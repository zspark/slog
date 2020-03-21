const MARKED = require("marked");

const common = require("../common");
const pathes = common.pathes;
const constant = common.constant;
var Base = require(pathes.pathMW + "middleware_module_base");
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const CC = require(pathes.pathCore + "content_controller");
const DV = require(pathes.pathCore + "disk_visitor");

class ModuleView extends Base {
  constructor() {
    super();
    this.file404 = pathes.pathTemplate + "template_file_404.ejs";
    this.galleryFolderPath = pathes.pathGallery;
    this.galleryFileURL = pathes.pathTemplate + "template_gallery.ejs";
    this.imagePathRelativeToPublic = "/share/gallery/";
    this.thumbnailPathRelativeToPublic = "/share/gallery/thumbnail/";
    this.thumbnailSuffix = ".thumbnail.jpg";
    this.articleListURL = pathes.pathTemplate + "template_article_list.ejs";
    this.historyURL = pathes.pathTemplate + "template_history.ejs";
  };

  _GetExtension(fileName) {
    let _li = fileName.lastIndexOf(".");
    return fileName.substring(_li + 1);
  }

  ComposeFile404(req, res) {
    let _obj = Object.create(null);
    _obj[constant.M_FILE_NAME] = req.query.n;
    this.RenderEjs(req, res, this.file404, { obj: _obj });
  };

  ComposeArticle(req, res) {
    let _fileName = req.query.n;
    let _content = DV.ReadFileUTF8(pathes.pathArticle + _fileName);
    if (_content == null) {
      _content = "";
      DV.WriteFileUTF8(pathes.pathArticle + _fileName, _content);
    }

    let _cfg = CC.GetConfig(_fileName);
    MARKED(_content, (err, content) => {
      if (err) {
        let _info = "marked parse error! file name:" + _fileName;
        LOG.Error(_info);
        res.end(_info);
      } else {
        ///TODO: to add a default template for article.
        const obj = Object.create(null);
        obj[constant.M_FILE_NAME] = _cfg[constant.M_FILE_NAME];
        obj[constant.M_TITLE] = _cfg[constant.M_TITLE];
        obj[constant.M_AUTHOR] = _cfg[constant.M_AUTHOR];
        obj[constant.M_LOGGED_IN] = Utils.CheckLogin(req);
        obj[constant.M_CREATE_TIME] = new Date(_cfg[constant.M_CREATE_TIME]).toDateString();
        obj[constant.M_CONTENT] = content;

        this.RenderEjs(req, res, pathes.pathTemplate + _cfg.template, { obj: obj });
      }
    });
  };

  ComposeArticleList(req, res) {
    let _category = req.query.c;
    let _list = CC.GetCategory(_category);
    if (!_list) { _list = []; }
    let _obj = [];
    _list.map(_fileName => {
      let _cfg = CC.GetConfig(_fileName);
      let _tmp = Object.create(null);
      _tmp[constant.M_FILE_NAME] = _fileName;
      _tmp[constant.M_TITLE] = _cfg[constant.M_TITLE];
      _tmp[constant.M_CREATE_TIME] = new Date(_cfg[constant.M_CREATE_TIME]).toDateString();
      _obj.push(_tmp);
    });

    this.RenderEjs(req, res, this.articleListURL, { obj: _obj });
  };

  ComposeHistoryList(req, res) {
    let _list = CC.GetHistoryArray();
    if (!_list) { _list = []; }
    let _obj = [];
    _list.map(_elem => {
      let _tmp = Object.create(null);
      _tmp[constant.M_FILE_NAME] = _elem[constant.M_FILE_NAME];
      _tmp[constant.M_TITLE] = _elem[constant.M_TITLE];
      _tmp[constant.M_ACTION] = _elem[constant.M_ACTION];
      _tmp[constant.M_TIME] = new Date(_elem[constant.M_TIME]).toDateString();
      //_tmp[constant.M_CREATE_TIME] = new Date(_cfg[constant.M_CREATE_TIME]).toDateString();
      _obj.push(_tmp);
    });

    this.RenderEjs(req, res, this.historyURL, { obj: _obj });
  };

  ComposeGalleryHtml(req, res) {
    var objArr = [];
    var arr = DV.ReadAllFileNamesInFolder(this.galleryFolderPath);
    arr.forEach(item => {
      objArr.push({
        imagePath: this.imagePathRelativeToPublic + item,
        thumbnailPath: this.thumbnailPathRelativeToPublic + item + this.thumbnailSuffix,
      });
    });

    this.RenderEjs(req, res, this.galleryFileURL, { obj: objArr });
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
