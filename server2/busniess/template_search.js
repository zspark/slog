const base = require("./template_base")
const PresentMode = require("../core/basic").PresentMode;

class SearchTemplate extends base {
    constructor() {
        super();
    }

    Generate() {
        let content = `<div class="input-group mb-3">
    <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon1">🔍</span>
    </div>
    <input type="search" class="form-control" id="searchInput" placeholder="input your searching content." autofocus="autofocus" aria-label="Username" aria-describedby="basic-addon1">
</div>
<div id=searchContent>nothing found</div>`;
        return this.GenerateHtml(null, this.GenerateHtmlBody(null, this.GenerateBodyMiddle("", content, null, "container top-offset-70"), null, this.GenerateBodyScript(`<script src="/lib/custom/search.js" defer></script>`)));
    }

    GenerateSearchContent(arrList) {
        if (arrList.length > 0) {
            let _out = "";
            let _makeHighlightString = function (str, r) {
                let _out = "";
                let index = 0;
                let i = 0;
                while (i < r.length) {
                    _out += str.substring(index, r[i]);
                    index = r[i] + r[i + 1];
                    _out += '<span class="CSS_search_highlight">' + str.substring(r[i], index) + '</span>';
                    i += 2;
                }
                _out += str.substring(index);
                return _out;
            }

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
    }
}

module.exports = SearchTemplate;