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
    let _content = DV.ReadFileUTF8(pathes.pathCode + fileName);
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
      let _list = CC.GetCategory(category);
      if (!_list) { _list = []; }
      let obj = [];
      _list.map(_fileName => {
        let _cfg = CC.GetConfig(_fileName);
        let _tmp = Object.create(null);
        _tmp[constant.M_FILE_NAME] = _fileName;
        _tmp[constant.M_TITLE] = _cfg[constant.M_TITLE];
        _tmp[constant.M_CREATE_TIME] = new Date(_cfg[constant.M_CREATE_TIME]).toDateString();
        obj.push(_tmp);
      });
      this.RenderEjs(req, res, this.articleListURL, { obj: obj });
    } else {
      let _info = "please enter your category name";
      LOG.Error(_info);
      res.end(_info);
    }
  };

  ComposeGalleryHtml(req, res) {
    var arr = DV.ReadAllFileNamesInFolder(this.galleryFolderPath);

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
      if (CC.GetConfig(_fileName)) {
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
    let _url = Utils.MakeArticleURL(constant.M_HOME);
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