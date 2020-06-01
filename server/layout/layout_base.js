const common = require("../core/common");

class LayoutBase {
    constructor() {
    }

    GenerateHtml(head, body) {
        return `<!DOCTYPE html> <html lang="en"> ${head == null ? this.GenerateHtmlHead() : head} ${body == null ? this.GenerateHtmlBody() : body} </html>`;
    }

    GenerateHtmlHead(css) {
        return `<head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta name="description" content="This is a developing blog site.">
<meta name="author" content="Jerry Chaos">
<title>Jerry Notes</title>
<!-- Bootstrap core CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
<link href="/lib/custom/style.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/themes/prism.min.css" rel="stylesheet" />
${css ? css : ""}
<!-- Favicons -->
<link rel="icon" href="/lib/custom/favicon.ico" type="image/x-icon"></head>`;
    }

    GenerateHtmlBody(top, middle, bottom, script) {
        return `<body onLoad="OnBodyLoad()"> ${top == null ? this.GenerateBodyTop() : top} ${middle == null ? this.GenerateBodyMiddle() : middle} ${bottom == null ? this.GenerateBodyBottom() : bottom} ${script == null ? this.GenerateBodyScript() : script}</body>`;
    }

    GenerateBodyTop(){
        return `<nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
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
                    <a class="dropdown-item" href="/view?c=linux">linux</a>
                </div>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/view?c=philosophy">Philosophy</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/view?c=math">Math</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/view?c=default">default</a>
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
    }

    GenerateBodyMiddle(top, middle, bottom, CSSclassName = "container") {
        return `<div class="${CSSclassName}">${top ? top : ""}${middle ? middle : ""}${bottom ? bottom : ""}</div>`;
    }

    GenerateBodyBottom() {
        return `<center><footer> &copy; 2011&ndash;2020 Jerry Chaos </footer></center>`;
    }

    GenerateBodyScript(script) {
        return `<script src="https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>

<!-- custom -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/prism.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/plugins/autoloader/prism-autoloader.js"></script>
<script>
    Prism.plugins.autoloader.languages_path = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/components/'
    function OnBodyLoad() {}
</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
${script ? script : ""}`;
    }

    GenerateInfoBoard(info) {
        let content = `<h1> 😈 Oops!!</h1> <p>${info}</p>`;
        return this.GenerateHtml(null, this.GenerateHtmlBody(null, this.GenerateBodyMiddle(null, content, null,"container top-offset-70"), null, null));
    }

    _GenerateInput(caption, id, value) {
        return `<div class="input-group mb-3">
    <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon3">${caption}</span>
    </div>
    <input type="text" id=${id} class="form-control" aria-describedby="basic-addon3" value="${value}" />
</div>`;
    }

    _GenerateCheckbox(caption, id, checked) {
        return `<div class="form-group form-check">
    <input type="checkbox" class="form-check-input" id=${id} ${checked ? "checked" : ""}>
    <label class="form-check-label" for="exampleCheck1">${caption}</label>
</div>`;
    }

};

/*
module.exports.GenerateHTMLInfoBoard = GenerateHTMLInfoBoard;
module.exports.GenerateHTMLPreview = GenerateHTMLPreview;
module.exports.GenerateHTMLGallery = GenerateHTMLGallery;
module.exports.GenerateHTMLManage = GenerateHTMLManage;
module.exports.GenerateHTMLRebuildSummay = GenerateHTMLRebuildSummay;
module.exports.GenerateHTMLListCategory = GenerateHTMLListCategory;
*/
module.exports = LayoutBase;