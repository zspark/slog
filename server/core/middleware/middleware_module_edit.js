const common = require("../common");
const pathes = common.pathes;
const constant = common.constant;
var Base = require(pathes.pathMW + "middleware_module_base");
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const FileFolderHandler = require(pathes.pathCore + 'disk_visitor');
const CC = require(pathes.pathCore + "content_controller");
const UserManager = require(pathes.pathCore + "user_manager");

class ModuleEdit extends Base {
  constructor() {
    super();
  };

  GetHandler(req, res) {
    const _fileName = Utils.GetQueryValueOfFileName(req);
    if (_fileName) {
      //Utils.SetCookie(req, "fileName",_fileName);
      let obj = Object.create(null);
      obj[constant.M_FILE_NAME] = _fileName;
      obj[constant.M_AUTHOR] = Utils.GetCookieUserName();
      obj[constant.M_CATEGORY] = "default";
      obj[constant.M_TITLE] = "";
      obj[constant.M_TEMPLATE] = "template_view.ejs";
      obj["content"] = "";

      var _cfg = CC.GetConfig(_fileName);
      if (_cfg) {
        obj[constant.M_AUTHOR] = _cfg[constant.M_AUTHOR];
        obj[constant.M_CATEGORY] = _cfg[constant.M_CATEGORY];
        obj[constant.M_TITLE] = _cfg[constant.M_TITLE];
        obj[constant.M_TEMPLATE] = _cfg[constant.M_TEMPLATE];
      }
      const fileURL = pathes.pathArticle + _fileName;
      let _content = FileFolderHandler.ReadFileUTF8(fileURL);
      if (_content != null) {
        obj["content"] = _content;
      }
      this.RenderEjs(req, res, this.editorHtmlURL, { obj: obj });
    } else {
      res.end("no assigned file name!");
    };
  };

  PostHandler(req, res) {
    //console.log(req.body);
    const _fileName = Utils.GetQueryValueOfFileName(req);
    const _content = req.body.content;

    // cancel modify
    if (_content == null) {
      if (CC.GetConfig(_fileName)) {
        let _url = Utils.MakeArticleURL(_fileName);
        res.redirect(_url);
      } else {
        let _url = Utils.MakeHomeURL(null);
        res.redirect(_url);
      }
      return;
    }

    // delete
    if (_content.trim() == "delete") {
      CC.Delete(_fileName);
      let _url = Utils.MakeHomeURL(null);
      res.redirect(_url);
      return;
    }

    // save
    const _title = req.body.title;
    const _author = req.body.author;
    const _category = req.body.category;
    const _template = req.body.template;
    if (CC.GetConfig(_fileName)) {
      CC.Modify(_fileName, _category, _title, _author, _template, _content);
    } else {
      CC.Add(_fileName, _category, _title, _author, _template, _content);
    }
    let _url = Utils.MakeArticleURL(_fileName);
    res.redirect(_url);
  };

  LoginFirst(req, res) {
    this.RenderEjs(req, res, this.loginHtmlURL, {});
  };

};

function Init() {
  let mw = new ModuleEdit();

  let get = function (req, res) {
    if (Utils.CheckLogin(req)) {
      mw.GetHandler(req, res);
    } else {
      mw.LoginFirst(req, res);
    }
  };
  let post = function (req, res) {
    if (Utils.CheckLogin(req)) {
      mw.PostHandler(req, res);
    } else {
      mw.LoginFirst(req, res);
    }
  };
  return { get: get, post: post };
};

module.exports.Init = Init;
