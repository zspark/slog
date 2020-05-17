const MARKED = require("marked");

const common = require("../core/common");
const pathes = common.pathes;
const constant = common.constant;
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const ArticleHandler = require(pathes.pathCore + "article_handler");
const IOSystem = require(pathes.pathCore + "io_system");
const TPLGEN = require(pathes.pathCore + "template_generator");
var Base = require(pathes.pathMW + "middleware_module_base");

class ModuleView extends Base {
    constructor() {
        super();
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
        this.galleryFolderPath = pathes.pathGallery;
        this.galleryFileURL = pathes.pathTemplate + "template_gallery.ejs";
        this.imagePathRelativeToPublic = "/share/gallery/";
        this.thumbnailPathRelativeToPublic = "/share/gallery/thumbnail/";
        this.thumbnailSuffix = ".thumbnail.jpg";
    };

    _GetExtension(fileName) {
        let _li = fileName.lastIndexOf(".");
        return fileName.substring(_li + 1);
    }

    ComposeArticle(req, res) {
        const _fileName = req.query.n;
        if (!ArticleHandler.HasConfig(_fileName)) return false;

        const _ac = ArticleHandler.GetConfig(_fileName);
        const _content = _ac.GetContent();
        MARKED(_content, (err, HTMLcontent) => {
            if (err) {
                const _info = `marked parse error! file name: ${_fileName}`;
                LOG.Error(_info);
                this.ComposeInfoboard(req, res, _info);
            } else {
                let _html = TPLGEN.GenerateHTMLArticle(
                    _ac.GetLayout(),
                    _fileName,
                    HTMLcontent,
                    _ac.GetTitle(),
                    _ac.GetAuthor(),
                    _ac.GetCreateTimeString()
                );
                res.end(_html);
            }
        });
    };

    ComposeArticleList(req, res) {
        const _list = ArticleHandler.GetCategory(req.query.c);
        if (_list) {
            let _arrObj = [];
            _list.ForEachFileName( _fileName => {
                const _ac = ArticleHandler.GetConfig(_fileName);
                _arrObj.push({
                    fileName: _ac.GetFileName(),
                    title: _ac.GetTitle(),
                    createTime: _ac.GetCreateTimeString(),
                });
            });
            let _html = TPLGEN.GenerateHTMLArticleList(_arrObj);
            res.end(_html);
        } else {
            this.ComposeInfoboard(req, res, `There is NO such category name:${req.query.c}. go back <a href="/">home.</a>`);
        }
    };

    ComposeHistoryList(req, res) {
        let _list = ArticleHandler.GetHistoryArray();
        if (_list) {
            let _arrObj = [];
            _list.map(_elem => {
                let _tmp = {
                    fileName: _elem.GetFileName(),
                    title: _elem.GetTitle(),
                    action: _elem.GetAction(),
                    time: _elem.GetTimeString(),
                };
                _arrObj.push(_tmp);
            });

            let _html = TPLGEN.GenerateHTMLHistory(_arrObj);
            res.end(_html);
        } else {
            this.ComposeInfoboard(req, res, `There is NO such category name. go back <a href="/">home.</a>`);
        }
    };

    ComposeGalleryHtml(req, res) {
        var _arrObj = [];
        var arr = IOSystem.ReadAllFileNamesInFolder(this.galleryFolderPath);
        arr.forEach(item => {
            _arrObj.push({
                imagePath: this.imagePathRelativeToPublic + item,
                thumbnailPath: this.thumbnailPathRelativeToPublic + item + this.thumbnailSuffix,
            });
        });

        let _html = TPLGEN.GenerateHTMLGallery(_arrObj);
        res.end(_html);
    }
};


/**
 * this is a bridge pattern;
 * this middleware handles URLs such as:
 * /view?c=<category>&n=<file name>&f=[true|false]
 */
function Init() {
    let mw = new ModuleView();

    let get = function (req, res) {
        const _fileName = req.query.n;
        if (_fileName) {
            if (ArticleHandler.HasConfig(_fileName)) {
                mw.ComposeArticle(req, res);
            } else {
                mw.ComposeFile404(req, res);
            }
            return;
        }

        const _categoryName = req.query.c;
        if (_categoryName) {
            mw.ComposeArticleList(req, res);
        } else {
            mw.ComposeURLFormatError(req, res);
        }
    };

    let getFrontPage = function (req, res) {
        let _url = Utils.MakeArticleURL("home");
        res.redirect(_url);
    };

    let getGallery = function (req, res) {
        mw.ComposeGalleryHtml(req, res);
    };

    let getHistory = function (req, res) {
        mw.ComposeHistoryList(req, res);
    };

    let post = function (req, res) {
        res.end("bad post");
    };

    return { get: get, getFrontPage: getFrontPage, getGallery: getGallery, getHistory: getHistory, post: post };
};

module.exports.Init = Init;
