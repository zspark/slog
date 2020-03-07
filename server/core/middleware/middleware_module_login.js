const common = require("../common");
const pathes = common.pathes;
var Base = require(pathes.pathMW + "middleware_module_base");
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const UserManager = require(pathes.pathCore + "user_manager");

class ModuleLogin extends Base {
  constructor() {
    super();
    this.loginHtmlURL = pathes.pathTemplate + "template_login.ejs";
  };

  GetHandler(req, res) {
    const _fileName = Utils.GetQueryValueOfFileName(req);
    if (_fileName) {
      this.RenderEjs(req, res, this.loginHtmlURL, { obj: { fileName: _fileName } });
    } else {
      this.RenderEjs(req, res, this.loginHtmlURL, { obj: {} });
    }
  }

  PostHandler(req, res) {
    const postData = req.body;
    //console.log(postData);
    const userInfo = UserManager.GetUserInfo(postData["account"]);
    if (userInfo) {
      if (userInfo.password === postData["password"]) {
        res.cookie("account", userInfo.account, { signed: true });//read cookies:(req.signedCookies.bwf) 
        const _fileName = Utils.GetQueryValueOfFileName(req);
        if(_fileName){
          let _url = Utils.MakeEditURL(_fileName);
          res.redirect(_url);
        } else {
          let _url = Utils.MakeHomeURL();
          res.redirect(_url);
        }
      } else {
        const _info = "Sorry wrong password! password:" + postData["password"];
        LOG.Error(_info);
        res.end(_info);
      }
    } else {
      const _info = "Sorry wrong account! account:" + postData["account"];
      LOG.Error(_info);
      res.end(_info);
    }
  };
};

function Init() {
  let mw = new ModuleLogin();

  let get = function (req, res) {
    mw.GetHandler(req, res);
  };

  let post = function (req, res) {
    mw.PostHandler(req, res);
  };
  return { get: get, post: post };
};

module.exports.Init = Init;
