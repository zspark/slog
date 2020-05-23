const common = require("./common");
const constant = common.constant;

var _GenerateHTMLhead = function (c) {
    let ret = `<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="This is a developing blog site.">
    <meta name="author" content="Jerry Chaos">
    <title>Jerry Notes</title>

    <!-- Bootstrap core CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link href="/lib/custom/style.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/themes/prism.min.css" rel="stylesheet" />
    ${c}

    <!-- Favicons -->
    <link rel="icon" href="/lib/custom/favicon.ico" type="image/x-icon">

    </head>`;
    return ret;
}


const _HTMLhead = _GenerateHTMLhead("");

const _HTMLhead_edit = _GenerateHTMLhead(`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/codemirror.min.css">
<style>
    .CodeMirror {
    border: 1px solid #eee;
    height: auto;
    font-size: 0.9em;
  }
</style>`);

const _HTMLhead_gallery = _GenerateHTMLhead(`<link type="text/css" href="lib/lightgallery/css/lightgallery.min.css" rel="stylesheet" />`);

const _body_top =
    `<nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
    <a class="navbar-brand" href="/">Navbar</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault"
        aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarsExampleDefault">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
                <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">Computer Science</a>
                <div class="dropdown-menu" aria-labelledby="dropdown01">
                    <a class="dropdown-item" href="/view?c=basic">basic</a>
                    <a class="dropdown-item" href="/view?c=major">graphics</a>
                    <a class="dropdown-item" href="/view?c=default">default</a>
                </div>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/view?c=philosophy">Philosophy</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/view?c=math">Math</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/search">Search</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/history">History</a>
            </li>
        </ul>
    </div>
</nav>`;

const _body_bottom = `<center><footer> &copy; 2011&ndash;2020 Jerry Chaos </footer></center>`;

var _GenerateHTMLscript = function (c) {
    let ret =
        `<script src="https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous">
</script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous">
</script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous">
</script>

<!-- custom -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/prism.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/plugins/autoloader/prism-autoloader.js"></script>
<script>
    Prism.plugins.autoloader.languages_path = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/components/'
    function OnBodyLoad() {}
</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
${c}`;
    return ret;
}

const _body_script = _GenerateHTMLscript("");

const _body_script_search = _GenerateHTMLscript(`<script src="/lib/custom/search.js" defer></script>`);

const _body_script_edit = _GenerateHTMLscript(`<script src="/lib/custom/editor.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/marked/0.8.1/marked.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/codemirror.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.0/mode/markdown/markdown.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/addon/selection/active-line.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/keymap/vim.min.js" defer></script>`);

const _body_script_gallery = _GenerateHTMLscript(`<script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.min.js"></script>
<script src="lib/lightgallery/js/lightgallery.min.js"></script>

<script type="text/javascript">
$(document).ready(function () {
    lightGallery(document.getElementById('lightgallery'), {
    thumbnail: true,
    animateThumb: false,
    showThumbByDefault: false
    });
});
</script>`);

var _GenerateArticleInfo = function (fileName, title, author, createTime) {
    let _tmp =
        `<div id="div-article-info">
    <p id="p-title"> ${title} </p>
    <p id="p-author"> ${author} | 📅 ${createTime} | <a href="/edit?n=${fileName}">edit</a> </p>
</div>`;
    return _tmp;
}

var _GenerateBodyMiddle = function (className, id, top, bottom) {
    let _tmp =
        `<main role="main" ${id ? "id=" + id : ""} ${className ? "class=" + className : ""}>
    ${top}
    ${bottom}
</main>`;
    return _tmp;
}

var _GenerateHTMLbody = function (HTMLbodyTop, HTMLbodyMiddle, HTMLbodyBottom, HTMLbodyScript) {
    let _HTMLbody =
        `<body onLoad="OnBodyLoad()">
${HTMLbodyTop}
${HTMLbodyMiddle}
${HTMLbodyBottom}
${HTMLbodyScript}
</body>`
    return _HTMLbody;
};

var _GenerateHTML = function (HTMLhead, HTMLbody) {
    let _HTML =
        `<!DOCTYPE html>
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
                let _HTMLtitle = _GenerateArticleInfo(fileName, title, author, createTime);
                let _HTMLbodyMiddle = _GenerateBodyMiddle("container", "div-body-middle", _HTMLtitle, content);
                _HTMLbody = _GenerateHTMLbody(_body_top, _HTMLbodyMiddle, _body_bottom, _body_script);
            }
            break;
        case constant.M_TEMPLATE_DEFAULT_NO_TITLE:
            {
                let _HTMLbodyMiddle = _GenerateBodyMiddle("container", "div-body-middle", "", content);
                _HTMLbody = _GenerateHTMLbody(_body_top, _HTMLbodyMiddle, _body_bottom, _body_script);
            }
            break;
        case constant.M_TEMPLATE_FULLSCREEN:
            {
                let _HTMLtitle = _GenerateArticleInfo(fileName, title, author, createTime);
                let _HTMLbodyMiddle = _GenerateBodyMiddle("container", "div-body-middle", _HTMLtitle, content);
                _HTMLbody = _GenerateHTMLbody("", _HTMLbodyMiddle, "", _body_script);
            }
            break;
        case constant.M_TEMPLATE_FULLSCREEN_NO_TITLE:
            {
                let _HTMLbodyMiddle = _GenerateBodyMiddle("container", "div-body-middle", "", content);
                _HTMLbody = _GenerateHTMLbody("", _HTMLbodyMiddle, "", _body_script);
            }
            break;
        default:
            break;
    };

    return _GenerateHTML(_HTMLhead, _HTMLbody);
};

var GenerateHTMLArticleList = function (category, arrList) {
    let _HTMLlist = "";
    arrList.forEach(function (item) {
        _HTMLlist += `<li>
<span><a href="/view?n=${item.fileName}">${item.title}</a></span> 
<span class="date">${item.createTime}</span>
</li>`;
    });

    let _content = `<h1>${category}</h1>
<ul class="articles">
    ${_HTMLlist}
</ul>`;

    let _HTMLbodyMiddle = _GenerateBodyMiddle("container", "div-body-middle", "", _content);
    let _HTMLbody = _GenerateHTMLbody(_body_top, _HTMLbodyMiddle, _body_bottom, _body_script);
    return _GenerateHTML(_HTMLhead, _HTMLbody);
}

var GenerateHTMLInfoBoard = function (info) {
    let _content = `<h1> 😈 Oops!!</h1> <p>${info}</p>`;

    let _HTMLbodyMiddle = _GenerateBodyMiddle("container", "div-body-middle", "", _content);
    let _HTMLbody = _GenerateHTMLbody(_body_top, _HTMLbodyMiddle, _body_bottom, _body_script);
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

    let _HTMLbodyMiddle = _GenerateBodyMiddle("container", "div-body-middle", "", _content);
    let _HTMLbody = _GenerateHTMLbody(_body_top, _HTMLbodyMiddle, _body_bottom, _body_script);
    return _GenerateHTML(_HTMLhead, _HTMLbody);
}

var _GenerateInput = function (caption, id, value) {
    return `<div class="input-group mb-3">
    <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon3">${caption}</span>
    </div>
    <input type="text" id=${id} class="form-control" aria-describedby="basic-addon3" value="${value}" />
</div>`;
}

var _GenerateCheckbox = function (caption, id, checked) {
    return `<div class="form-group form-check">
    <input type="checkbox" class="form-check-input" id=${id} ${checked ? "checked" : ""}>
    <label class="form-check-label" for="exampleCheck1">${caption}</label>
</div>`;
}

var GenerateHTMLEdit = function (content, title, author, categoryName, allowHistory, templateOptions) {
    let _out =
            `<div class="bg-dark fixed-top">
    <button type="button" id="Delete" onclick="Delete()" class="btn btn-danger btn-sm">Delete</button>
    <button type="button" id="Cancel" onclick="Cancel()" class="btn btn-primary btn-sm">Cancel</button> 
    <button type="button" id="Save" onclick="Save()" class="btn btn-secondary btn-sm">Save</button> 
    <button type="button" id="SaveAndExit" onclick="SaveAndExit()" class="btn btn-secondary btn-sm">SaveAndExit</button> 
    <button type="button" id="Property" onclick="Property()" class="btn btn-primary btn-sm">Property ...</button>
</div>

<div class="modal fade" id="alertModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Alert</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p id="alertContent"></p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="btn-continue">Continue</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="propertyModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Property</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                ${_GenerateInput("title", "inputTitle", title)}
                ${_GenerateInput("author", "inputAuthor", author)}
                ${_GenerateInput("category", "inputCategory", categoryName)}

                <label for="message-text" class="col-form-label">layout:</label>
                <div class="input-group">
                    <select class="custom-select" id="slcTemplate" aria-label="Example select with button addon">
                        <option value="1">default</option>
                        <option value="2">default_no_title</option>
                        <option value="3">fullscreen</option>
                        <option value="4">fullscreen_no_title</option>
                    </select>
                </div>

                ${_GenerateCheckbox("allow history","cbAllowHistory",allowHistory)}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="btn-save">Save</button>
            </div>
        </div>
    </div>
</div>`;

    let _content =
        `<div class="row">
    <div class="col">
        <textarea id="markdown" class="inputPane" form="myform" name="content">${content}</textarea>
    </div>
    <div class="col">
        <iframe id="preview" src="/edit/previewHtml"></iframe>
    </div>
</div>`;

    let _HTMLbodyMiddle = _GenerateBodyMiddle("", "editor", "", _content);
    let _HTMLbody = _GenerateHTMLbody(_out, _HTMLbodyMiddle, "", _body_script_edit);
    return _GenerateHTML(_HTMLhead_edit, _HTMLbody);
}

var GenerateHTMLLogin = function (fileName) {
    let _content = `<div id='login'>
    <div class="text-center mb-4">
        <h1 class="h3 mb-3 font-weight-normal">Login</h1>
        <p id="msg">Build form controls with floating labels via the <code>:placeholder-shown</code> pseudo-element. <a href="https://caniuse.com/#feat=css-placeholder-shown">Works in latest Chrome, Safari, and Firefox.</a></p>
    </div>

    <input type="email" name="account" id="inputAccount" class="form-control" placeholder="Email address" required autofocus>
    <br>
    <input type="password" name="password" id="inputPassword" class="form-control" placeholder="Password" required>
    <br>
    <button class="btn btn-lg btn-primary btn-block" type="submit" id="submit" onclick='post()'>Sign in</button>

    <script src="/lib/custom/login.js" defer></script>
    <script src="/lib/md5/md5.min.js" defer></script>
</div>`
    let _HTMLbodyMiddle = _GenerateBodyMiddle("container", "div-body-middle", "", _content);
    let _HTMLbody = _GenerateHTMLbody(_body_top, _HTMLbodyMiddle, _body_bottom, _body_script);
    return _GenerateHTML(_HTMLhead, _HTMLbody);
};

var GenerateHTMLPreview = function () {
    let _HTMLbodyMiddle = _GenerateBodyMiddle("div-preview", "div-body-middle", "", "");
    let _HTMLbody = _GenerateHTMLbody("", _HTMLbodyMiddle, "", _body_script);
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

    let _HTMLbodyMiddle = _GenerateBodyMiddle("basic_outer_div_code", "div-body-middle", "", _content);
    let _HTMLbody = _GenerateHTMLbody(_body_top, _HTMLbodyMiddle, _body_bottom, _body_script_gallery);
    return _GenerateHTML(_HTMLhead_gallery, _HTMLbody);
};

var GenerateHTMLManage = function () {
    let _content = `<h1>Commands:</h1>
<p>rebuild summary file:</p>
<p><a href="/manage?cmd=rebuildSummary">/manage?cmd=rebuildSummary</a></p>
<br>
<p>list all category names:</p>
<p><a href="/manage?cmd=listCategories">/manage?cmd=listCategories</a></p>`;

    let _HTMLbodyMiddle = _GenerateBodyMiddle("container", "div-body-middle", "", _content);
    let _HTMLbody = _GenerateHTMLbody(_body_top, _HTMLbodyMiddle, _body_bottom, _body_script);
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

    let _HTMLbodyMiddle = _GenerateBodyMiddle("container", "div-body-middle", "", _content);
    let _HTMLbody = _GenerateHTMLbody(_body_top, _HTMLbodyMiddle, _body_bottom, _body_script);
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

    let _HTMLbodyMiddle = _GenerateBodyMiddle("container", "div-body-middle", "", _content);
    let _HTMLbody = _GenerateHTMLbody(_body_top, _HTMLbodyMiddle, _body_bottom, _body_script);
    return _GenerateHTML(_HTMLhead, _HTMLbody);
};

var GenerateHTMLSearch = function () {
    let _content = `<div class="input-group mb-3">
    <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon1">🔍</span>
    </div>
    <input type="search" class="form-control" id="searchInput" placeholder="input your searching content." autofocus="autofocus" aria-label="Username" aria-describedby="basic-addon1">
</div>
<div id=searchContent>nothing found</div>`;

    let _HTMLbodyMiddle = _GenerateBodyMiddle("container", "div-body-middle", "", _content);
    let _HTMLbody = _GenerateHTMLbody(_body_top, _HTMLbodyMiddle, _body_bottom, _body_script_search);
    return _GenerateHTML(_HTMLhead, _HTMLbody);
};

var GenerateHTMLSearchContent = function (arrList) {
    if (arrList.length > 0) {
        var _makeHighlightString = function (str, r) {
            let _out = "";
            let index = 0;
            let i = 0;
            while (i < r.length) {
                _out += str.substring(index, r[i]);
                index = r[i] + r[i + 1];
                _out += '<span class="CSS_search_highlight">' + str.substring(r[i], index) + '</span>';
                i += 2;
            };
            _out += str.substring(index);
            return _out;
        }
        let _out = "";
        arrList.forEach(function (item) {
            if (item.from == "name") {
                _out += `<li><span><a href="/view?n=${item.fileName}">`;
                _out += _makeHighlightString(item.fileName, item.range);
                _out += `</a></span>`;
                _out += `<span> | ${item.title}</span>`;
                _out += `<span class="CSS_search_author"> | ${item.author}</span>`;
            } else if (item.from == "title") {
                _out += `<li><span>${item.fileName}</span><span> | <a href="/view?n=${item.fileName}">`;
                _out += _makeHighlightString(item.title, item.range);
                _out += `</a></span>`;
                _out += `<span class="CSS_search_author"> | ${item.author}</span>`;
            }
            _out += `</li>`;
        });
        return `<ul>${_out}</ul>`;
    } else {
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