const multer  = require('multer')

const common = require("../common");
const pathes = common.pathes;
var Base = require(pathes.pathMW + "middleware_module_base");
const LOG = require(pathes.pathCore+'logger');
const Utils = require(pathes.pathCore+"utils");
const UserManager = require(pathes.pathCore+"user_manager");
const FileFolderHandler = require(pathes.pathCore+'disk_visitor');

var upload = multer({ dest: './public/share/uploads/' })
//var uploadImg = upload.single('avatar').array("photos", 12);
var uploadImg = upload.array("photos", 12);

class ModuleUpload extends Base {
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
        const fileName = Utils.GetQueryValue(req, "fileName");
        if (fileName) {
          uploadImg(req, res, (req, res) => {

            // req.file is the `avatar` file
            // req.body will hold the text fields, if there were any

            const fileURL = articleFolderPath + fileName;
            FileFolderHandler.ReadFileUTF8_async(fileURL, file => {
              const obj = { file: file };
              Utils.RenderEjs(editorHtmlURL, { obj: obj }, res);
            });
          });
        } else {
          /*
          res.setHeader("Set-Cookie", "foo=bar");
          res.setHeader("Set-Cookie", "tobi=ferret;Expires=Tue,08 Jun 2021 10:18:14 GMT");
          */
          req.session.account = userInfo.account;
          res.end("Hello " + userInfo.displayName);
        }
      } else {
        res.end("Sorry wrong password!");
      }
    } else {
      res.end("Sorry wrong account!");
    }
  };

};

function Init() {
  let mw = new ModuleUpload();

  return function (req, res) {
    switch (req.method) {
      case "GET":
        mw.GetHandler(req, res);
        break;
      case "POST":
        mw.PostHandler(req, res);
        break;
      default:
        res.end("can NOT recognise!");
        break;
    };
  };

};

module.exports.Init = Init;
