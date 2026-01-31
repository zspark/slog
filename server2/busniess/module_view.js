const MARKED = require("marked");
const Result = require("../core/basic").Result;
const Authorization = require("../authorization/module_authorization");
const Base = require("./module_busniess_base");
const ViewTemplate = require("./template_view");
const Utils = require("../core/utils");

class ModuleView extends Base {
    constructor() {
        super();
        this.template = new ViewTemplate();
        MARKED.setOptions({
            /*
            renderer: new marked.Renderer(),
            highlight: function (code, language) {
              const hljs = require('highlight.js');
              const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
              return hljs.highlight(validLanguage, code).value;
            },
            */
            pedantic: false,
            gfm: true,
            breaks: false,
            sanitize: false,
            smartLists: true,
            smartypants: true,
            xhtml: false
        });
    };

    _HandleGetArticleRequest(req, res, authority, fileName) {
        let _a = authority.GetArticle(fileName);
        if (!_a) {
            this.ComposeInfoboard(req, res, "");
            return;
        }

        let _c = {};
        if (authority.FetchArticleContent(fileName, _c) < 0) {
            this.ComposeInfoboard(req, res, _c.msg);
            return;
        }

        let that = this;
        MARKED(_c.data, (err, HTMLcontent) => {
            if (err) {
                const _info = `marked parse error! file name: ${fileName}, error code:${err}`;
                that.LogError(_info);
                this.ComposeInfoboard(req, res, _info);
            } else {
                let _html = this.template.GenerateArticle(
                    _a.presentMode, fileName, HTMLcontent,
                    _a.displayName, "xxxx", _a.createInfo.displayTimeString
                );
                res.end(_html);
            }
        });

    }

    _HandleGetArticleListRequest(req, res, authority) {
        let _out = {};
        const _categoryName = req.query.c;
        if (_categoryName) {
            if (authority.FetchArticleListByTagName(_categoryName, _out) > 0) {
                this._ComposeArticleListHTML(req, res, _out.data);
            } else {
                this.ComposeInfoboard(req, res, _out.msg);
            }
        }
    }

    _ComposeArticleListHTML(req, res, tag) {
        if (tag.arrArticle.length > 0) {
            let _arrObj = [];
            tag.arrArticle.forEach((_a) => {
                _arrObj.push({
                    fileName: _a.fileName,
                    title: _a.displayName,
                    createTime: _a.createTime
                });
            });
            let _html = this.template.GenerateArticleList(tag.displayName, _arrObj);
            res.end(_html);
        } else {
            this.ComposeInfoboard(req, res, `can NOT find anything about ${n}. go back <a href="/">home.</a>`);
        }
    }

    HandleGetRequest(req, res) {
        let _out = {};
        Authorization.GetAuthority(req, _out);
        const _fileName = req.query.n;
        if (_fileName) {
            this._HandleGetArticleRequest(req, res, _out.data, _fileName);
        } else {
            this._HandleGetArticleListRequest(req, res, _out.data);
        }
    }
}

// /view?c=<category>&n=<file name>&f=[true|false]
let mw = new ModuleView();

module.exports.get = (req, res) => {
    mw.HandleGetRequest(req, res);
}
module.exports.getFrontPage = (req, res) => {
    let _url = Utils.MakeArticleURL("home");
    res.redirect(_url);
}
