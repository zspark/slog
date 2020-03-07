var previewElem = null;
var markdownElem = null;
var changeTimeout = null;
var inputDirty = true;
var needSubmit = false;
var editor = null;


function OnBodyLoad() {
  console.log("editor body loaded!");

  previewElem = document.querySelector('#preview');
  markdownElem = document.getElementById('markdown');
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
};

function submitFun_cancel(form) {
  if(needSubmit) return confirm("You have changes which are NOT submitted. Do your really want to cancel editing?!");
  else return true;
};

function submitFun(form) {
  if (form.category.value == '') {
    alert("enter category.");
    return false;
  }
  if (form.title.value == '') {
    alert("enter title.");
    return false;
  }
  if (form.author.value == '') {
    alert("enter author.");
    return false;
  }
  return true;
};

function TryRenderToHTML() {
  if (inputDirty) {
    inputDirty = false;
    var startTime = new Date();

    marked(markdownElem.value, (err, mdHtml) => {
      if (err) {
        previewElem.innerHTML = ("marked parse error!");
      } else {
        previewElem.innerHTML = (mdHtml);
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
