
var searchInput = null;
var searchContent = null;
var changeTimeout = null;
const MAX_DELAY_TIME_MS = 500;
function OnBodyLoad() {
  searchContent = document.getElementById("searchContent");
  searchInput = document.getElementById("searchInput");
  searchInput.addEventListener('input', function () {
    clearTimeout(changeTimeout);
    changeTimeout = window.setTimeout(_PostSearch, MAX_DELAY_TIME_MS);
  });

  searchInput.addEventListener('keypress', function (event) {
    if (event.keyCode == "13") {
      clearTimeout(changeTimeout);
      _PostSearch();
    }
  });
}

function _PostSearch() {
  let _searchValue = searchInput.value;
  if (_searchValue == "") return;
  _PostXHR(_searchValue, html => {
    /*
    const reg = new RegExp(_searchValue, "g");
    var newinner = html.replace(reg, '<span class="CSS_search_highlight">' + _searchValue + '</span>')//处理HTML字符串，为目标文本加上样式，即替换对应的HTML结构
    */
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
