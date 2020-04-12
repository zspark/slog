const MARKED = require("marked");

const common = require("../common");
const pathes = common.pathes;
const constant = common.constant;
var Base = require(pathes.pathMW + "middleware_module_base");
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const CC = require(pathes.pathCore + "content_controller");
const DV = require(pathes.pathCore + "disk_visitor");
const TPLGEN = require(pathes.pathCore + "template_generator");

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

  ComposeFile404(req, res) {
    this.ComposeInfoboard(req, res, `This file is NOT exist,click to <a href="/edit?n=${req.query.n}">create.</a>`);
  };

  ComposeArticle(req, res) {
    let _fileName = req.query.n;
    let _content = DV.ReadFileUTF8(pathes.pathArticle + _fileName);
    if (_content == null) {
      _content = "";
      DV.WriteFileUTF8(pathes.pathArticle + _fileName, _content);
    }

    MARKED(_content, (err, HTMLcontent) => {
      if (err) {
        let _info = "marked parse error! file name:" + _fileName;
        LOG.Error(_info);
        res.end(_info);
      } else {
        let _cfg = CC.GetConfig(_fileName);
        let _time = new Date(_cfg[constant.M_CREATE_TIME]).toDateString();
        let _html = TPLGEN.GenerateHTMLArticle(_cfg.template, _fileName, HTMLcontent, _cfg.title, _cfg.author, _time);
        res.end(_html);
      }
    });
  };

  ComposeArticleList(req, res) {
    let _category = req.query.c;
    let _list = CC.GetCategory(_category);
    if (!_list) { _list = []; }
    let _arrObj = [];
    _list.map(_fileName => {
      let _cfg = CC.GetConfig(_fileName);
      let _tmp = {
        fileName: _fileName,
        title: _cfg.title,
        createTime: new Date(_cfg.createTime).toDateString(),
      };
      _arrObj.push(_tmp);
    });

    let _html = TPLGEN.GenerateHTMLArticleList(_arrObj);
    res.end(_html);
  };

  ComposeHistoryList(req, res) {
    let _list = CC.GetHistoryArray();
    if (!_list) { _list = []; }
    let _arrObj = [];
    _list.map(_elem => {
      let _tmp = {
        fileName: _elem.fileName,
        title: _elem.title,
        action: _elem.action,
        time: new Date(_elem.time).toDateString(),
      };
      _arrObj.push(_tmp);
    });

    let _html = TPLGEN.GenerateHTMLHistory(_arrObj);
    res.end(_html);
  };

  ComposeGalleryHtml(req, res) {
    var _arrObj = [];
    var arr = DV.ReadAllFileNamesInFolder(this.galleryFolderPath);
    arr.forEach(item => {
      _arrObj.push({
        imagePath: this.imagePathRelativeToPublic + item,
        thumbnailPath: this.thumbnailPathRelativeToPublic + item + this.thumbnailSuffix,
      });
    });

    let _html = TPLGEN.GenerateHTMLGallery(_arrObj);
    res.end(_html);
  };
};


/**
 * this middleware handles URLs such as:
 * /view?c=<category>&n=<file name>&f=[true|false]
 */
function Init() {
  let mw = new ModuleView();

  let get = function (req, res) {
    const _fileName = req.query.n;
    if (_fileName) {
      if (CC.GetConfig(_fileName)) {
        mw.ComposeArticle(req, res);
      } else {
        mw.ComposeFile404(req, res);
      }
      return;
    }

    const _category = req.query.c;
    if (_category) {
      mw.ComposeArticleList(req, res);
    } else {
      mw.ComposeURLFormatError(req, res);
    }
  };

  let getFrontPage = function (req, res) {
    let _url = Utils.MakeArticleURL(constant.M_HOME);
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
