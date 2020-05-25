const common = require("../core/common");
const constant = common.constant;
var base = require(common.pathes.pathLayout + "layout_base")

class LayoutView extends base {
    constructor() {
        super();
    }

    GenerateArticle(template, fileName, content, title, author, createTime) {
        switch (template) {
            case constant.M_TEMPLATE_DEFAULT:
                {
                    let middleTop = this._GenerateArticleInfo(fileName, title, author, createTime);
                    return this.GenerateHtml( null, this.GenerateHtmlBody( null, this.GenerateBodyMiddle( middleTop, content, null, "container top-offset-70"), null, null)
                    );
                }
            case constant.M_TEMPLATE_DEFAULT_NO_TITLE:
                return this.GenerateHtml(null, this.GenerateHtmlBody(null, this.GenerateBodyMiddle(null, content, null, "container top-offset-70"), null, null));
            case constant.M_TEMPLATE_FULLSCREEN:
                {
                    let middleTop = this._GenerateArticleInfo(fileName, title, author, createTime);
                    return this.GenerateHtml(null, this.GenerateHtmlBody("", this.GenerateBodyMiddle(middleTop, content, null, ""), "", null));
                }
            case constant.M_TEMPLATE_FULLSCREEN_NO_TITLE:
                return this.GenerateHtml(null, this.GenerateHtmlBody("", this.GenerateBodyMiddle(null, content, null, ""), "", null));
            default:
                return this.GenerateHtml(null, null);
        };
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

    _GenerateArticleInfo(fileName, title, author, createTime) {
        return `<div id="div-article-info">
    <p id="p-title"> ${title} </p>
    <p id="p-author"> ${author} | 📅 ${createTime} | <a href="/edit?n=${fileName}">edit</a> </p>
</div>`;
    }

};

module.exports = LayoutView;