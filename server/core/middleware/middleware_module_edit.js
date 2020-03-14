const common = require("../common");
const pathes = common.pathes;
const constant = common.constant;
var Base = require(pathes.pathMW + "middleware_module_base");
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const DV = require(pathes.pathCore + 'disk_visitor');
const CC = require(pathes.pathCore + "content_controller");
const UserManager = require(pathes.pathCore + "user_manager");

class ModuleEdit extends Base {
  constructor() {
    super();
    this.editorHtmlURL = pathes.pathTemplate + "template_editor.ejs";
    this.noPermissionHtmlURL = pathes.pathTemplate + "template_no_permission.ejs";
  };

  HandleAuthorCheck(req, res, queryObj) {
    const _fileName = queryObj[constant.M_FILE_NAME];
    var _cfg = CC.GetConfig(_fileName);
    if (_cfg) {
      const _accountInfo = UserManager.GetUserInfo(Utils.GetUserAccount(req));
      const _accountDisplayName = _accountInfo[constant.M_ACCOUNT_DISPLAY_NAME];
      if (_accountDisplayName != _cfg[constant.M_AUTHOR]) {
        LOG.Warn("you have NO permission to edit this file!");
        let _obj = Object.create(null);
        _obj[constant.M_FILE_NAME] = _fileName;
        this.RenderEjs(req, res, this.noPermissionHtmlURL, { obj: _obj });
        return true;
      }
    }
    return false;
  }

  GetHandler(req, res, queryObj) {
    LOG.Info("edit get handler.");
    const _fileName = queryObj[constant.M_FILE_NAME];

    let _obj = Object.create(null);
    _obj[constant.M_FILE_NAME] = _fileName;
    _obj[constant.M_AUTHOR] = UserManager.GetUserInfo(Utils.GetUserAccount(req)).displayName;
    _obj[constant.M_CATEGORY] = constant.M_CATEGORY_DEFAULT;
    _obj[constant.M_TITLE] = "";
    _obj[constant.M_TEMPLATE] = "template_view.ejs";
    _obj[constant.M_CONTENT] = "";

    var _cfg = CC.GetConfig(_fileName);
    if (_cfg) {
      _obj[constant.M_AUTHOR] = _cfg[constant.M_AUTHOR];
      _obj[constant.M_CATEGORY] = _cfg[constant.M_CATEGORY];
      _obj[constant.M_TITLE] = _cfg[constant.M_TITLE];
      _obj[constant.M_TEMPLATE] = _cfg[constant.M_TEMPLATE];
    }

    const _fileURL = pathes.pathArticle + _fileName;
    let _content = DV.ReadFileUTF8(_fileURL);
    if (_content != null) {
      _obj[constant.M_CONTENT] = _content;
    }

    this.RenderEjs(req, res, this.editorHtmlURL, { obj: _obj });
    return true;
  };

  HandlePostArticle(req, res, queryObj) {
    //console.log(req.body);
    const _fileName = queryObj[constant.M_FILE_NAME];
    const _content = req.body.content;

    // cancel modify
    if (_content == null) {
      if (CC.GetConfig(_fileName)) {
        let _url = Utils.MakeArticleURL(_fileName);
        res.redirect(_url);
      } else {
        let _url = Utils.MakeHomeURL();
        res.redirect(_url);
      }
      return true;
    }

    // delete
    if (_content.trim() == "delete") {
      CC.Delete(_fileName);
      let _url = Utils.MakeHomeURL();
      res.redirect(_url);
      return true;
    }

    // save
    const _title = req.body[constant.M_TITLE];
    const _author = req.body[constant.M_AUTHOR];
    const _category = req.body[constant.M_CATEGORY];
    const _template = req.body[constant.M_TEMPLATE];
    if (CC.GetConfig(_fileName)) {
      CC.Modify(_fileName, _category, _title, _author, _template, _content);
    } else {
      CC.Add(_fileName, _category, _title, _author, _template, _content);
    }
    let _url = Utils.MakeArticleURL(_fileName);
    res.redirect(_url);
    return true;
  };

  LoginFirst(req, res, queryObj) {
    const _fileName = queryObj[constant.M_FILE_NAME];
    if (_fileName) {
      let _url = Utils.MakeLoginWithViewURL(_fileName);
      res.redirect(_url);
    } else {
      let _url = Utils.MakeLoginURL();
      res.redirect(_url);
    }
  };

};

function Init() {
  let mw = new ModuleEdit();

  let get = function (req, res) {
    const _q = Utils.GetQueryValues(req);
    if (Utils.CheckLogin(req)) {
      const _fileName = _q[constant.M_FILE_NAME];
      if (_fileName) {
        if (!mw.HandleAuthorCheck(req, res, _q)) {
          mw.GetHandler(req, res, _q);
        }
      } else {
        let _msg = "no assigned file name!";
        LOG.Info(_msg);
        res.end(_msg);
      }
    } else {
      mw.LoginFirst(req, res, _q);
    }
  };

  let post = function (req, res) {
    const _q = Utils.GetQueryValues(req);
    if (Utils.CheckLogin(req)) {
      mw.HandlePostArticle(req, res, _q);
    } else {
      mw.LoginFirst(req, res, _q);
    }
  };
  return { get: get, post: post };
};

module.exports.Init = Init;
