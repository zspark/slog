const common = require("../common");
const pathes = common.pathes;
const constant = common.constant;
var Base = require(pathes.pathMW + "middleware_module_base");
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const UserManager = require(pathes.pathCore + "user_manager");

class ModuleLogin extends Base {
  constructor() {
    super();
    this.loginHtmlURL = pathes.pathTemplate + "template_login.ejs";
  };

  GetHandler(req, res, queryObj) {
    const _fileName = queryObj[constant.M_FILE_NAME];
    if (_fileName) {
      this.RenderEjs(req, res, this.loginHtmlURL, { obj: { fileName: _fileName } });
    } else {
      this.RenderEjs(req, res, this.loginHtmlURL, { obj: {} });
    }
  }

  PostHandler(req, res, queryObj) {
    let _url = Utils.MakeHomeURL();
    const _fileName = queryObj[constant.M_FILE_NAME];
    if (_fileName) {
      _url = Utils.MakeEditURL(_fileName);
    }
    res.redirect(_url);
  };
};

function Init() {
  let mw = new ModuleLogin();

  let get = function (req, res) {
    const _q = Utils.GetQueryValues(req);
    mw.GetHandler(req, res, _q);
  };

  let post = function (req, res) {
    const _account = req.body["account"];
    const _userInfo = UserManager.GetUserInfo(_account);
    if (_userInfo) {
      const _pwd = req.body["password"];
      if (_userInfo.password === _pwd) {
        res.cookie("account", _userInfo.account, { signed: true });//read cookies:(req.signedCookies.bwf) 
        const _q = Utils.GetQueryValues(req);
        mw.PostHandler(req, res, _q);
      } else {
        let _info = "Sorry wrong password!";
        LOG.Error(_info);
        res.end(_info);
      }
    } else {
      let _info = "Sorry wrong account! account:" + _account;
      LOG.Error(_info);
      res.end(_info);
    }
  };
  return { get: get, post: post };
};

module.exports.Init = Init;
