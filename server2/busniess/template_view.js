const base = require("./template_base")
const PresentMode = require("../core/basic").PresentMode;

class ViewTemplate extends base {
    constructor() {
        super();
    }

    GenerateArticle(mode, fileName, content, title, author, createTime) {
        switch (mode) {
            case PresentMode.DEFAULT: {
                let middleTop = this._GenerateArticleInfo(fileName, title, author, createTime);
                return this.GenerateHtml(null, this.GenerateHtmlBody(null, this.GenerateBodyMiddle(middleTop, content, null, "container top-offset-70"), null, null)
                );
            }
            case PresentMode.NO_TITLE:
                return this.GenerateHtml(null, this.GenerateHtmlBody(null, this.GenerateBodyMiddle(null, content, null, "container top-offset-70"), null, null));
            case PresentMode.FULLSCREEN:
                return this.GenerateHtml(null, this.GenerateHtmlBody("", this.GenerateBodyMiddle(null, content, null, ""), "", null));
            default:
                return this.GenerateHtml(null, null);
        }
    }

    GenerateArticleList(categoryName, arrList) {
        let _tmp = "";
        arrList.forEach(function (item) {
            _tmp += `<li>
    <span><a href="/view?n=${item.fileName}">${item.title}</a></span> 
    <span class="date">${item.createTime}</span>
</li>`;
        });
        let content = `<h1>${categoryName}</h1> <ul class="articles">${_tmp}</ul>`;

        return this.GenerateHtml(null, this.GenerateHtmlBody(null, this.GenerateBodyMiddle("", content, null, "container top-offset-70"), null, null));
    }

    GenerateGallery(arrList) {
        let _out = "";
        arrList.forEach(function (item) {
            _out += `<a href="${item.imagePath}"> <img src="${item.thumbnailPath}"> </a>`;
        });

        let content =
            `<div id="lightgallery" style=" margin-top: 20px; ">
    ${_out}
</div>`

        let head = this.GenerateHtmlHead(`<link type="text/css" href="lib/lightgallery/css/lightgallery.min.css" rel="stylesheet" />`);

        let script = this.GenerateBodyScript(`<script src="lib/lightgallery/js/lightgallery.min.js"></script>
<script type="text/javascript">
$(document).ready(function () {
    lightGallery(document.getElementById('lightgallery'), {
    thumbnail: true,
    animateThumb: false,
    showThumbByDefault: false
    });
});
</script>`);

        return this.GenerateHtml(head, this.GenerateHtmlBody(null, this.GenerateBodyMiddle("", content, null, "container top-offset-70"), "", script));
    }

    _GenerateArticleInfo(fileName, title, author, createTime) {
        return `<div id="div-article-info">
    <p id="p-title"> ${title} </p>
    <p id="p-author"> ${author} | 📅 ${createTime} | <a href="/edit?n=${fileName}">edit</a> </p>
</div>`;
    }

}

module.exports = ViewTemplate;