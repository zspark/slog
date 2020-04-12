
var searchInput = null;
var searchContent = null;
var changeTimeout = null;
const MAX_DELAY_TIME_MS = 500;
function OnBodyLoad() {
  searchContent = document.getElementById("searchContent");
  searchInput = document.getElementById("searchInput");
  searchInput.addEventListener('input', function () {
    clearTimeout(changeTimeout);
    changeTimeout = window.setTimeout(_TryRenderToHTML, MAX_DELAY_TIME_MS);
  });

  searchInput.addEventListener('keypress', function (event) {
    if (event.keyCode == "13") {
      clearTimeout(changeTimeout);
      _TryRenderToHTML();
    }
  });
}

function _TryRenderToHTML() {
  if (searchInput.value == "") return;
  _PostXHR(searchInput.value, html => {
    searchContent.innerHTML = html;
  });
}

function _PostXHR(str, fn) {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/search', true);
  xhr.responseType = 'text';
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        fn(xhr.response);
        return;
      }
    }
  }
  /*
  let _fn = function () {
    if (xhr.status != 200) {
      _StopHeartBeat("error");
    }
  }
  xhr.onreadystatechange = _fn;
  xhr.onprogress = _fn;
  xhr.onerror = function () { _StopHeartBeat("error"); }
  xhr.onabort = function () { _StopHeartBeat("error"); }
  */

  let _jsonString = JSON.stringify({ content: str });
  xhr.send(_jsonString);
};
