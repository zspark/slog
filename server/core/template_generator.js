const common = require("./common");
const constant = common.constant;

const _HTMLhead =
    `<head>
  <meta charset="utf-8">
  <title>Spark Notes</title>
  <meta name="description" content="This is a developing blog site.">
  <link rel="icon" href="/lib/custom/favicon.ico" type="image/x-icon">
  <link href="/lib/custom/style.css" rel="stylesheet">
  <!--link rel="stylesheet" href="/lib/prismjs/prism.css" data-noprefix /-->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/themes/prism.min.css" rel="stylesheet" />
</head>`;

const _HTMLhead_edit = _HTMLhead +
    `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/codemirror.min.css">
<style>
  .CodeMirror {
    border: 1px solid #eee;
    height: auto;
    font-size: 0.9em;
  }
</style>`

const _HTMLhead_gallery = _HTMLhead + `<link type="text/css" href="lib/lightgallery/css/lightgallery.min.css" rel="stylesheet" />`;

const _HTMLbody_top =
    `<header>
  <center>
    <h1><a href="/"><span style="color:rgb(161, 85, 0);">Jerry</span>Chaos</a></h1>
    <ul id="menu">
      <li><a href="/">🏠Home</a></li>
      <li><a href="/view?c=basic">Basic</a></li>
      <li><a href="/view?c=major">Major</a></li>
      <li><a href="/view?c=philosophy">Philosophy</a></li>
      <li><a href="/view?c=math">Math</a></li>
      <li><a href="/view?c=default">Default</a></li>
      <li><a href="/search">🔍Search</a></li>
      <li><a href="/history">⏳History</a></li>
    </ul>
  </center>
</header>`;

const _HTMLbody_bottom = `<footer> &copy; 2011&ndash;2020 Jerry Chaos </footer>`;

const _HTMLbody_script =
    `<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/prism.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/plugins/autoloader/prism-autoloader.js"></script>
<script>
    Prism.plugins.autoloader.languages_path = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/components/'
    function OnBodyLoad() {}
</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>`;

const _HTMLbody_script_search =`<script src="/lib/custom/search.js" defer></script>`;

const _HTMLbody_script_edit =
    `<script src="/lib/custom/editor.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/marked/0.8.1/marked.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/codemirror.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/mode/markdown/markdown.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/addon/selection/active-line.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/keymap/vim.min.js" defer></script>`;

const _HTMLbody_script_gallery =
`<script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.min.js"></script>
<script src="lib/lightgallery/js/lightgallery.min.js"></script>

<script type="text/javascript">
$(document).ready(function () {
    lightGallery(document.getElementById('lightgallery'), {
    thumbnail: true,
    animateThumb: false,
    showThumbByDefault: false
    });
});
</script>`;


var _GenerateHTMLTitle = function (fileName, title, author, createTime) {
    let _HTMLtitle = `<p id="title"> ${title} </p>
<p id="author"> ${author} | ${createTime} | <a href="/edit?n=${fileName}">edit</a> </p>`;
    return _HTMLtitle;
}

var _GenerateHTMLbodyMiddle = function (outerDivID, HTMLtitle, HTMLcontent) {
    let _HTMLbody = `<div id="${outerDivID}">
    ${HTMLtitle}
    ${HTMLcontent}
</div>`;
    return _HTMLbody;
}

var _GenerateHTMLbody = function (HTMLbodyTop, HTMLbodyMiddle, HTMLbodyBottom, HTMLbodyScript) {
    let _HTMLbody = `<body onLoad="OnBodyLoad()">
${HTMLbodyTop}
${HTMLbodyMiddle}
${HTMLbodyBottom}
${HTMLbodyScript}
</body>`
    return _HTMLbody;
};

var _GenerateHTML = function (HTMLhead, HTMLbody) {
    let _HTML = `<!DOCTYPE html>
<html lang="en">
${HTMLhead}
${HTMLbody}
</html>`;
    return _HTML;
}

var GenerateHTMLArticle = function (template, fileName, content, title, author, createTime) {
    let _HTMLbody = "";

    switch (template) {
        case constant.M_TEMPLATE_DEFAULT:
            {
                let _HTMLtitle = _GenerateHTMLTitle(fileName, title, author, createTime);
                let _HTMLbodyMiddle = _GenerateHTMLbodyMiddle("basic_outer_div", _HTMLtitle, content);
                _HTMLbody = _GenerateHTMLbody(_HTMLbody_top, _HTMLbodyMiddle, _HTMLbody_bottom, _HTMLbody_script);
            }
            break;
        case constant.M_TEMPLATE_DEFAULT_NO_TITLE:
            {
                let _HTMLbodyMiddle = _GenerateHTMLbodyMiddle("basic_outer_div", "", content);
                _HTMLbody = _GenerateHTMLbody(_HTMLbody_top, _HTMLbodyMiddle, _HTMLbody_bottom, _HTMLbody_script);
            }
            break;
        case constant.M_TEMPLATE_FULLSCREEN:
            {
                let _HTMLtitle = _GenerateHTMLTitle(fileName, title, author, createTime);
                let _HTMLbodyMiddle = _GenerateHTMLbodyMiddle("basic_outer_div_code", _HTMLtitle, content);
                _HTMLbody = _GenerateHTMLbody("", _HTMLbodyMiddle, "", _HTMLbody_script);
            }
            break;
        case constant.M_TEMPLATE_FULLSCREEN_NO_TITLE:
            {
                let _HTMLbodyMiddle = _GenerateHTMLbodyMiddle("basic_outer_div_code", "", content);
                _HTMLbody = _GenerateHTMLbody("", _HTMLbodyMiddle, "", _HTMLbody_script);
            }
            break;
        default:
            break;
    };

    return _GenerateHTML(_HTMLhead, _HTMLbody);
};

var GenerateHTMLArticleList = function (arrList) {
    let _HTMLlist = "";
    arrList.forEach(function (item) {
        _HTMLlist += `<li>
<span><a href="/view?n=${item.fileName}">${item.title}</a></span> 
<span class="date">${item.createTime}</span>
</li>`;
    });

    let _content = `<h1>article list:</h1>
<ul class="articles">
    ${_HTMLlist}
</ul>`;

    let _HTMLbodyMiddle = _GenerateHTMLbodyMiddle("basic_outer_div", "", _content);
    let _HTMLbody = _GenerateHTMLbody(_HTMLbody_top, _HTMLbodyMiddle, _HTMLbody_bottom, _HTMLbody_script);
    return _GenerateHTML(_HTMLhead, _HTMLbody);
}

var GenerateHTMLInfoBoard = function (info) {
    let _content = `<h1> 😈 Oops!!</h1> <p>${info}</p>`;

    let _HTMLbodyMiddle = _GenerateHTMLbodyMiddle("basic_outer_div", "", _content);
    let _HTMLbody = _GenerateHTMLbody(_HTMLbody_top, _HTMLbodyMiddle, _HTMLbody_bottom, _HTMLbody_script);
    return _GenerateHTML(_HTMLhead, _HTMLbody);
}

var GenerateHTMLHistory = function (arrList) {
    let _HTMLlist = "";
    arrList.forEach(function (item) {
        _HTMLlist += `<li>
    <span><a href="/view?n=${item.fileName}">${item.title}</a></span>
    <span class="date">${item.action}</span>
    <span class="date">${item.time}</span>
</li>`;
    });

    let _content = `<h1>⏳History</h1><h1>These articles were modified/created/deleted recently.</h1>
<ol class="history">
    ${_HTMLlist}
</ol>`;

    let _HTMLbodyMiddle = _GenerateHTMLbodyMiddle("basic_outer_div", "", _content);
    let _HTMLbody = _GenerateHTMLbody(_HTMLbody_top, _HTMLbodyMiddle, _HTMLbody_bottom, _HTMLbody_script);
    return _GenerateHTML(_HTMLhead, _HTMLbody);
}

var GenerateHTMLEdit = function (content, title, author, category, allowHistory, templateOptions) {
    let _GenrateHeader_edit = function (arr) {
        let _out1 =
            `<div id="float_buttons">
    <center>
        <span><button type="button" id="Delete" onclick='Delete()'>Delete</button></span>
        <span><button type="button" id="Cancel" onclick='Cancel()'>Cancel</button></span>
        <span><button type="button" id="Save" onclick='Save()'>Save</button></span>
        <span><button type="button" id="SaveAndExit" onclick='SaveAndExit()'>SaveAndExit</button></span>

        <span><input type="text" id="inputTitle" style="width:300px;" placeholder="<title>" value="${title}" /></span>
        <span><input type="text" id="inputAuthor" style="width:100px;" placeholder="<author>" value="${author}" /></span>
        <span><input type="text" id="inputCategory" style="width:100px;" placeholder="<category>" value="${category}" /></span>

        <select id="slcTemplate">`;

        let _out2 = "";
        arr.forEach(function (item) {
            _out2 += `<option>${item}</option>`;
        });

        let _out3 = `</select>
        <span><input type="checkbox" id="cbTypeMap" onchange="ChangeTypeMode()" />vim mode</span>
        <span><input type="checkbox" id="cbAllowHistory" ${allowHistory ? "checked" : ""} />allow history</span>
    </center>
</div>`
        return _out1 + _out2 + _out3;
    }

    let _content = `<div id="editor">
    <div class="containers">
        <div class="container">
            <textarea id="markdown" class="inputPane" form="myform" name="content">${content}</textarea>
        </div>
        <div class="container">
            <iframe id="preview" src="/edit/previewHtml"></iframe>
        </div>
    </div>
</div>`;

    let _HTMLbodyMiddle = _GenerateHTMLbodyMiddle("basic_outer_div_edit", "", _content);
    let _HTMLbody = _GenerateHTMLbody(_GenrateHeader_edit(templateOptions), _HTMLbodyMiddle, "", _HTMLbody_script_edit);
    return _GenerateHTML(_HTMLhead_edit, _HTMLbody);
}

var GenerateHTMLLogin = function (fileName) {
    let _content = `<div>
    <div id="msg"></div>
    <div>
        <span>account:</span>
        <span><input type="email" name="account" id="inputAccount" placeholder="Email address"></span>
    </div>

    <div>
        <span>password:</span>
        <span><input type="password" name="password" id="inputPassword" placeholder="Password"></span>
    </div>

    <button type="button" id="submit" onclick='post()'>Sign in</button>

    <script src="/lib/custom/login.js" defer></script>
    <script src="/lib/md5/md5.min.js" defer></script>
</div>`
    let _HTMLbodyMiddle = _GenerateHTMLbodyMiddle("basic_outer_div", "", _content);
    let _HTMLbody = _GenerateHTMLbody(_HTMLbody_top, _HTMLbodyMiddle, _HTMLbody_bottom, _HTMLbody_script);
    return _GenerateHTML(_HTMLhead, _HTMLbody);
};

var GenerateHTMLPreview = function () {
    let _HTMLbodyMiddle = _GenerateHTMLbodyMiddle("basic_outer_div_preview", "", "");
    let _HTMLbody = _GenerateHTMLbody("", _HTMLbodyMiddle, "", _HTMLbody_script);
    return _GenerateHTML(_HTMLhead, _HTMLbody);
};

var GenerateHTMLGallery = function (arrList) {
    let _out = "";
    arrList.forEach(function (item) {
        _out += `<a href="${item.imagePath}"> <img src="${item.thumbnailPath}"> </a>`;
    });

    let _content =
    `<div id="lightgallery" style=" margin-top: 20px; ">
    ${_out}
</div>`

    let _HTMLbodyMiddle = _GenerateHTMLbodyMiddle("basic_outer_div_code", "", _content);
    let _HTMLbody = _GenerateHTMLbody(_HTMLbody_top, _HTMLbodyMiddle, _HTMLbody_bottom, _HTMLbody_script_gallery);
    return _GenerateHTML(_HTMLhead_gallery, _HTMLbody);
};

var GenerateHTMLManage = function () {
    let _content = `<h1>Commands:</h1>
<p>rebuild summary file:</p>
<p><a href="/manage?cmd=rebuildSummary">/manage?cmd=rebuildSummary</a></p>
<br>
<p>list all category names:</p>
<p><a href="/manage?cmd=listCategories">/manage?cmd=listCategories</a></p>`;

    let _HTMLbodyMiddle = _GenerateHTMLbodyMiddle("basic_outer_div", "", _content);
    let _HTMLbody = _GenerateHTMLbody(_HTMLbody_top, _HTMLbodyMiddle, _HTMLbody_bottom, _HTMLbody_script);
    return _GenerateHTML(_HTMLhead, _HTMLbody);
};

var GenerateHTMLRebuildSummay = function (countBefore, contentBefore, countAfter, contentAfter) {
    let _content =
        `<h1>before rebuild:</h1>
<span>articles:</span> <span> ${countBefore} </span>
<p>
    ${contentBefore}
</p>

<h1>after rebuild:</h1>
<span>articles:</span> <span> ${countAfter} </span>
<p> ${contentAfter} </p>`;

    let _HTMLbodyMiddle = _GenerateHTMLbodyMiddle("basic_outer_div", "", _content);
    let _HTMLbody = _GenerateHTMLbody(_HTMLbody_top, _HTMLbodyMiddle, _HTMLbody_bottom, _HTMLbody_script);
    return _GenerateHTML(_HTMLhead, _HTMLbody);
};

var GenerateHTMLListCategory = function (arrList) {
    let _out = "";
    arrList.forEach(function (name) {
        _out += ` <li> <p><a href="/view?c=${name}">${name}</a></p> </li>`;
    });

    let _content = `<h1>category name list:</h1>
<ul>
    ${_out}
</ul>`;

    let _HTMLbodyMiddle = _GenerateHTMLbodyMiddle("basic_outer_div", "", _content);
    let _HTMLbody = _GenerateHTMLbody(_HTMLbody_top, _HTMLbodyMiddle, _HTMLbody_bottom, _HTMLbody_script);
    return _GenerateHTML(_HTMLhead, _HTMLbody);
};

var GenerateHTMLSearch = function () {
    let _content = `<h1> 🔍 Search</h1>
<center><input type="search" id="searchInput" placeholder="input your searching content." autofocus="autofocus"/></center>
<div id=searchContent>nothing found</div>`;

    let _HTMLbodyMiddle = _GenerateHTMLbodyMiddle("basic_outer_div", "", _content);
    let _HTMLbody = _GenerateHTMLbody(_HTMLbody_top, _HTMLbodyMiddle, _HTMLbody_bottom, _HTMLbody_script_search);
    return _GenerateHTML(_HTMLhead, _HTMLbody);
};

var GenerateHTMLSearchContent = function (arrList) {
    if (arrList.length > 0) {
        let _out = "";
        arrList.forEach(function (item) {
            _out += `<li><span><a href="/view?n=${item.fileName}">${item.content}</a></span> - <span id="CSS_search_from">from:${item.from}</span></li>`;
        });
        return `<ul>${_out}</ul>`;
    }else{
        return `nothing found!`;
    }
};

module.exports.GenerateHTMLArticle = GenerateHTMLArticle;
module.exports.GenerateHTMLArticleList = GenerateHTMLArticleList;
module.exports.GenerateHTMLInfoBoard = GenerateHTMLInfoBoard;
module.exports.GenerateHTMLHistory = GenerateHTMLHistory;
module.exports.GenerateHTMLEdit = GenerateHTMLEdit;
module.exports.GenerateHTMLLogin = GenerateHTMLLogin;
module.exports.GenerateHTMLPreview = GenerateHTMLPreview;
module.exports.GenerateHTMLGallery = GenerateHTMLGallery;
module.exports.GenerateHTMLManage = GenerateHTMLManage;
module.exports.GenerateHTMLRebuildSummay = GenerateHTMLRebuildSummay;
module.exports.GenerateHTMLListCategory = GenerateHTMLListCategory;
module.exports.GenerateHTMLSearch = GenerateHTMLSearch;
module.exports.GenerateHTMLSearchContent = GenerateHTMLSearchContent;