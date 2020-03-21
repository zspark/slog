var previewElem = null;
var markdownElem = null;
var titleElem = null;
var authorElem = null;
var categoryElem = null;
var templateElem = null;
var outerDivElem = null;

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
  previewElem = document.getElementById('preview');
  markdownElem = document.getElementById('markdown');
  outerDivElem = document.getElementById('basic_outer_div_edit');
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
    inputStyle: "contenteditable"
  });
  editor.on("change", function (ins, obj) {
    editor.save();
    inputDirty = true;
    needSubmit = true;
  });

  TryRenderToHTML();

  heartbeatIntervalID = setInterval(() => {
    PostHeartBeat();
  }, 10000);
};

function StopHeartBeat() {
  if (heartbeatIntervalID != null) {
    clearInterval(heartbeatIntervalID);
    heartbeatIntervalID = null;
    outerDivElem.id = "basic_outer_div_edit_error";
    console.error("connect failed.");
  }
}

function TryRenderToHTML() {
  if (inputDirty) {
    inputDirty = false;
    var startTime = new Date();

    marked(markdownElem.value, (err, content) => {
      if (err) {
        previewElem.innerHTML = ("marked parse error!");
      } else {
        previewElem.innerHTML = (content);
      }
    });

    var endTime = new Date();
    var delayTime = endTime - startTime;
    if (delayTime < 100) {
      delayTime = 100;
    } else if (delayTime > 500) {
      delayTime = 1000;
    }
  }

  changeTimeout = window.setTimeout(TryRenderToHTML, delayTime);
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

function Delete() {
  let _r = confirm("Are your sure to delete this article?");
  if (_r) {
    PostXHR(_CreatePostData(10), (json) => {
      if (json.code == 9999){
        window.location.href = json.redirectURL;
      }else{
        console.error(json.msg);
        outerDivElem.id = "basic_outer_div_edit_error";
      }
    });
  }
};

function Cancel() {
  let _r = true;
  if (needSubmit) {
    _r = confirm("You have changes which are NOT saved. Do you really want to cancel editing?");
  }
  if (_r) {
    PostXHR(_CreatePostData(20), (json) => {
      if (json.code == 9999) {
        window.location.href = json.redirectURL;
      }else{
        console.error(json.msg);
        outerDivElem.id = "basic_outer_div_edit_error";
      }
    });
  }
};

function Save() {
  if (_CheckCompletion()) {
    PostXHR(_CreatePostData(1), (json) => {
      if (json.code != 9999) {
        console.error(json.msg);
        outerDivElem.id = "basic_outer_div_edit_error";
      }
    });
  }
};

function SaveAndExit() {
  if (_CheckCompletion()) {
    PostXHR(_CreatePostData(2), (json) => {
      if (json.code == 9999) {
        window.location.href = json.redirectURL;
      }else{
        console.error(json.msg);
        outerDivElem.id = "basic_outer_div_edit_error";
      }
    });
  }
};

function PostHeartBeat() {
  PostXHR(_CreatePostData(0), (json) => {
    if (json.code != 9999) {
      console.error(json.msg);
      outerDivElem.id = "basic_outer_div_edit_error";
    }
  });
};

function PostXHR(obj, fn) {
  if (heartbeatIntervalID == null) return;

  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/edit' + window.location.search, true);
  xhr.responseType = 'json';
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        if (fn) fn(xhr.response);
        return;
      }
    }
  }
  xhr.onreadystatechange = function () { };
  xhr.onprogress=function(){
    if (xhr.status != 200) {
      StopHeartBeat();
    }
  }
  xhr.onerror=function(){
    StopHeartBeat();
  }
  xhr.onabort=function(){
    StopHeartBeat();
  }

  let _jsonString = JSON.stringify(obj);
  xhr.send(_jsonString);
};

function _CheckCompletion(){
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
