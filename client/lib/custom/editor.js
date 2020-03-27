var previewElem = null;
var markdownElem = null;
var titleElem = null;
var authorElem = null;
var categoryElem = null;
var templateElem = null;
var floatDiv = null;
var iframeWnd = null;

var changeTimeout = null;
var heartbeatIntervalID = null;
var inputDirty = true;
var needSubmit = false;
var editor = null;


function OnBodyLoad() {
  console.log("editor body loaded!");

  titleElem = document.getElementById("inputTitle");
  authorElem = document.getElementById("inputAuthor");
  categoryElem = document.getElementById("inputCategory");
  templateElem = document.getElementById("inputTemplate");
  let _tmp = document.getElementById('preview');
  iframeWnd = _tmp.contentWindow;
  previewElem = iframeWnd.document.getElementById("basic_outer_div_preview");
  markdownElem = document.getElementById('markdown');
  floatDiv = document.getElementById('float_buttons');
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
    nonEmpty:true,
    inputStyle: "contenteditable"
  });
  editor.on("change", function (ins, obj) {
    editor.save();
    inputDirty = true;
    needSubmit = true;
  });

  _TryRenderToHTML();

  heartbeatIntervalID = setInterval(() => {
    _PostXHR(_CreatePostData(0), null);
  }, 10000);
};

function _StopHeartBeat(msg) {
  if (heartbeatIntervalID != null) {
    clearInterval(heartbeatIntervalID);
    heartbeatIntervalID = null;
    floatDiv.id = "float_buttons_error";
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
      iframeWnd.Prism.highlightAll()
      iframeWnd.MathJax.typeset()
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
    "title": titleElem.value,
    "author": authorElem.value,
    "category": categoryElem.value,
    "template": templateElem.value,
  };
  if (action == 1 || action == 2) {
    _obj["content"] = markdownElem.value;
  }
  return _obj;
}

function _Redirect(json) {
  window.location.href = json.redirectURL;
}

function Delete() {
  let _r = confirm("Are your sure to delete this article?");
  if (_r) {
    _PostXHR(_CreatePostData(10), _Redirect);
  }
};

function _CheckConnection() {
  if (heartbeatIntervalID == null) {
    alert("you has dis-connected with server, copy your article and try reopen to edit!");
    return false;
  } else { return true; }
}

function Cancel() {
  if (_CheckConnection()) {
    let _r = true;
    if (needSubmit) {
      _r = confirm("You have changes which are NOT saved. Do you really want to cancel editing?");
    }
    if (_r) {
      _PostXHR(_CreatePostData(20), _Redirect);
    }
  }
};

function Save() {
  if (_CheckConnection()) {
    if (_CheckCompletion()) {
      _PostXHR(_CreatePostData(1), null);
    }
  }
};

function SaveAndExit() {
  if (_CheckConnection()) {
    if (_CheckCompletion()) {
      _PostXHR(_CreatePostData(2), _Redirect);
    }
  }
};

function _PostXHR(obj, fn) {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/edit' + window.location.search, true);
  xhr.responseType = 'json';
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        let _json = xhr.response;
        if (_json.code === 9999) {
          if (fn) fn(_json);
        }else{
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

  let _jsonString = JSON.stringify(obj);
  xhr.send(_jsonString);
};

function _CheckCompletion() {
  if (categoryElem.value == '') {
    alert("enter category.");
    return false;
  }
  if (titleElem.value == '') {
    alert("enter title.");
    return false;
  }
  if (authorElem.value == '') {
    alert("enter author.");
    return false;
  }
  if (templateElem.value == '') {
    alert("enter template.");
    return false;
  }
  return true;
}
