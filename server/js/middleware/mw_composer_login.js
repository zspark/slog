const pathes = require("../pathes");
const LOG = require(pathes.pathJS + 'debug_logger');
const Utils = require(pathes.pathJS + "utils");
const UserManager = require(pathes.pathJS + "user_manager");
const FileFolderHandler = require(pathes.pathJS + 'file_folder_handler');
var Base = require(pathes.pathMW + "composer_base");

class ComposerLogin extends Base {
  constructor() {
    super();
  };


  GetHandler(req, res) {
    this.RenderEjs(this.loginHtmlURL, {}, res);
  };

  PostHandler(req, res) {
    const postData = req.body;
    //console.log(postData);
    const userInfo = UserManager.GetUserInfo(postData["account"]);
    if (userInfo) {
      if (userInfo.password === postData["password"]) {
        res.cookie("account", userInfo.account, { signed: true });//read cookies:(req.signedCookies.bwf) 
        /*
        const fileName = Utils.GetQueryValue(req, "fileName");
        if (fileName) {
          const fileURL = this.articleFolderPath + fileName;
          FileFolderHandler.ReadFileUTF8_async(fileURL, file => {
            const obj = { file: file };
            Utils.RenderEjs(editorHtmlURL, { obj: obj }, res);
          });
        } else {
          res.setHeader("Set-Cookie", "foo=bar");
          res.setHeader("Set-Cookie", "tobi=ferret;Expires=Tue,08 Jun 2021 10:18:14 GMT");
          LOG.Error("no file name!");
          //TODO,jerry:req.session.account = userInfo.account;
          res.end("Hello " + userInfo.displayName);
        }
          */
        let _url = Utils.MakeHomeURL({});
        res.redirect(_url);
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

function LoginHtmlComposer() {
  let mw = new ComposerLogin();

  return function (req, res) {
    switch (req.method) {
      case "GET":
        mw.GetHandler(req, res);
        break;
      case "POST":
        mw.PostHandler(req, res);
        break;
      default:
        res.end("can NOT recegnise!");
        break;
    };
  };

};

module.exports.LoginHtmlComposer = LoginHtmlComposer;
