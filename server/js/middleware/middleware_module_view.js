const common = require("../common");
const pathes = common.pathes;
var Base = require(pathes.pathMW + "middleware_module_base");
const LOG = require(pathes.pathJS + 'debug_logger');
const Utils = require(pathes.pathJS + "utils");
const aco = require(pathes.pathJS + "article_config_organizer");
const File = require(pathes.pathJS + "file_folder_handler");

class ModuleView extends Base {
  constructor() {
    super();
    this.codeViewTemplateURL = pathes.pathTemplate + "template_code_viewer.ejs";
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

  ComposeCodeViewPage(req, res, fileName) {
    let _content = FileFolderHandler.ReadFileUTF8(pathes.pathCode + fileName);
    if (_content == null) {
      res.end("file NOT exist!");
    } else {
      let _nCtt = "```" + this._GetExtension(fileName) + "\r\n" + _content + "\r\n```";
      MARKED(_nCtt, (err, _htmlContent) => {
        if (err) {
          let _info = "marked parse error! file name:" + fileName;
          LOG.Error(_info);
          res.end(_info);
        } else {
          let _obj = Object.create(null);
          _obj.content = _htmlContent;
          this.RenderEjs(req, res, TemplateURL, { obj: _obj });
        }
      });
    }
  };

  ComposeArticleList(req, res, category) {
    if (category) {
      let _list = aco.GetCategory(category);
      if (!_list) { _list = []; }
      let obj = [];
      _list.map(_fileName => {
        let _cfg = aco.GetConfig(_fileName);
        obj.push({
          "fileName": _fileName,
          "displayName": _cfg["displayName"],
          "displayTime": new Date(_cfg["createTime"]).toDateString()
        });
      });
      this.RenderEjs(req, res, this.articleListURL, { obj: obj });
    } else {
      let _info = "please enter your category name";
      LOG.Error(_info);
      res.end(_info);
    }
  };

  ComposeGalleryHtml(req, res) {
    var arr = File.ReadAllFileNamesInFolder(this.galleryFolderPath);

    var objArr = [];
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
    const _fileName = Utils.GetQueryValueOfFileName(req);
    if (_fileName) {
      if (aco.GetConfig(_fileName)) {
        mw.ComposeArticleWithFileName(req, res, _fileName);
      } else {
        mw.ComposeArticle404(req, res, _fileName);
      }
    } else {
      const _category = Utils.GetQueryValueOfCategory(req);
      if(_category){
        mw.ComposeArticleList(req, res, _category);
      }else{
        mw.ComposeURLFormatError(req, res);
      }
    };
  };

  let getCode = function (req, res) {
    const _fileName = Utils.GetQueryValueOfFileName(req);
    if (_fileName) {
      mw.ComposeCodeViewPage(req, res, _fileName);
    } else {
      res.end("no file name assign!");
    };
  };

  let getFrontPage = function (req, res) {
    let _url = Utils.MakeArticleURL("_front_page_");
    res.redirect(_url);
  };

  let getGallery = function (req, res) {
    mw.ComposeGalleryHtml(req, res);
  };

  let post = function (req, res) {
    res.end("bad post");
  };

  return { get: get, getCode: getCode, getFrontPage: getFrontPage, getGallery: getGallery, post: post };
};

module.exports.Init = Init;