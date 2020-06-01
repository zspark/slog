var previewElem = null;
var markdownElem = null;
var titleElem = null;
var authorElem = null;
var categoryElem = null;
var cbTypeMapElem = null;
var cbAllowHistoryElem = null;
var slcTemplateElem = null;

var changeTimeout = null;
var heartbeatIntervalID = null;
var inputDirty = true;
var needSubmit = false;
var editor = null;
var alertModal = null;
var propertyModal = null;


function OnBodyLoad() {
    console.log("editor body loaded!");

    titleElem = $('#inputTitle');
    authorElem = $('#inputAuthor');
    categoryElem = $('#inputCategory');
    slcTemplateElem = $("#slcTemplate");
    cbAllowHistoryElem = $("#cbAllowHistory");

    cbTypeMapElem = document.getElementById("cbTypeMap");
    previewElem = document.getElementById("div-preview");
    markdownElem = document.getElementById('markdown');
    alertModal = $('#alertModal');
    propertyModal = $('#propertyModal');



    changeTimeout = null;
    inputDirty = true;

    editor = CodeMirror.fromTextArea(markdownElem, {
        lineNumbers: true,
        mode: "markdown",
        keyMap: "default",
        //keyMap: "vim",
        matchBrackets: true,
        showCursorWhenSelecting: true,
        viewportMargin: Infinity,
        lineWrapping: true,
        theme: "default",
        styleActiveLine: true, // 当前行背景高亮
        nonEmpty: true,
        inputStyle: "contenteditable"
    });
    editor.on("change", function (ins, obj) {
        editor.save();
        inputDirty = true;
        needSubmit = true;
    });

    _TryRenderToHTML();

    heartbeatIntervalID = setInterval(() => {
        _PostXHRAction(_CreatePostData(0), null);
    }, 10000);
};

function _StopHeartBeat(msg) {
    if (heartbeatIntervalID != null) {
        clearInterval(heartbeatIntervalID);
        heartbeatIntervalID = null;
        console.error(msg);
    }
}

function _TryRenderToHTML() {
    let _delayTime = 400;
    if (inputDirty) {
        inputDirty = false;
        let _startTime = new Date();

        marked(markdownElem.value, (err, content) => {
            if (err) {
                previewElem.innerHTML = "marked parse error!"
            } else {
                previewElem.innerHTML = content;
            }
        });

        try {
            window.Prism.highlightAll()
            window.MathJax.typeset()
        } catch (e) {
            console.error(e);
        }

        _delayTime = Math.max(400, new Date() - _startTime);
    }

    changeTimeout = window.setTimeout(_TryRenderToHTML, _delayTime);
};

/**
 * action:
 *  0 -> heartbeat
 *  1 -> save
 *  2 -> save and exit
 *  10 ->delete 
 *  20 ->cancel
 */
function _CreatePostData(action) {
    let _obj = {
        "time": new Date(),
        "action": action,
        "title": titleElem.val(),
        "author": authorElem.val(),
        "category": categoryElem.val(),
        "template": slcTemplateElem.find("option:selected").text(),
        "allowHistory": cbAllowHistoryElem.is(':checked'),
    };
    if (action == 1 || action == 2) {
        _obj["content"] = markdownElem.value;
    }
    return _obj;
}

function _Redirect(json) {
    window.location.href = json.redirectURL;
}

function ChangeTypeMode() {
    if (cbTypeMapElem.checked) {
        editor.setOption("keyMap", "vim");
    } else {
        editor.setOption("keyMap", "default");
    }
}

var alertionShowed = false;
function ShowProperty(alertInfo) {
    if(alertionShowed){
        alertionShowed = false;
        $('.alert').alert('close')
    }
    if (alertInfo) {
        $("#alertion").append(`<div class="alert alert-warning alert-dismissible fade show" role="alert">
  ${alertInfo}
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>`);
        alertionShowed = true;
    }
    let title = titleElem.val();
    let author = authorElem.val();
    let category = categoryElem.val();
    $('#btn-cancel').click((e) => {
        propertyModal.modal("hide");
        titleElem.val(title);
        authorElem.val(author);
        categoryElem.val(category);
    });
    $('#btn-save').click((e) => {
        propertyModal.modal("hide");
    });
    propertyModal.modal("toggle");
}

function Property() {
    ShowProperty(null);
};

function Delete() {
    _ShowAlertModal("Are your sure to delete this article?", (e) => {
        alertModal.modal("hide");
        _PostXHRAction(_CreatePostData(10), _Redirect);
    });
};

function _CheckConnection() {
    if (heartbeatIntervalID == null) {
        alert("you has dis-connected with server, copy your article and try reopen to edit!");
        return false;
    } else { return true; }
}

function _ShowAlertModal(info, cbFn) {
    $('#alertContent').text(info);
    $('#btn-continue').click((e) => {
        alertModal.modal("hide");
        if (cbFn) cbFn();
    });
    alertModal.modal("toggle");
}

function Cancel() {
    if (_CheckConnection()) {
        if (needSubmit) {
            _ShowAlertModal("You have changes which are NOT saved. Do you really want to cancel editing?",
                () => {
                    _PostXHRAction(_CreatePostData(20), _Redirect);
                }
            );
        } else {
            _PostXHRAction(_CreatePostData(20), _Redirect);
        }
    }
};

function Save() {
    if (_CheckConnection()) {
        if (_CheckCompletion()) {
            _PostXHRAction(_CreatePostData(1), null);
        }
    }
};

function SaveAndExit() {
    if (_CheckConnection()) {
        if (_CheckCompletion()) {
            _PostXHRAction(_CreatePostData(2), _Redirect);
        }
    }
};

function _PostXHRAction(obj, fn) {
    let _jsonString = JSON.stringify(obj);
    _PostXHR(_jsonString, '/edit' + window.location.search, 'json', "application/json", fn);
}

function _PostXHR(obj, url, responseType, contentType, fn) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.responseType = responseType;
    if (contentType) xhr.setRequestHeader("Content-Type", contentType);
    xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                let _json = xhr.response;
                if (_json.code >= 5000) {
                    if (fn) fn(_json);
                } else {
                    _StopHeartBeat(_json.msg);
                }
                return;
            }
        }
        _StopHeartBeat("error");
    }
    let _fn = function () {
        if (xhr.status != 200) {
            _StopHeartBeat("error");
        }
    }
    xhr.onreadystatechange = _fn;
    xhr.onprogress = _fn;
    xhr.onerror = function () { _StopHeartBeat("error"); }
    xhr.onabort = function () { _StopHeartBeat("error"); }

    xhr.send(obj);
};

function _CheckCompletion() {
    if (categoryElem.val() == '') {
        ShowProperty("enter category");
        return false;
    }
    if (titleElem.val() == '') {
        ShowProperty("enter title");
        return false;
    }
    if (authorElem.val() == '') {
        ShowProperty("enter author");
        return false;
    }
    return true;
}
