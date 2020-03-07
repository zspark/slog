const multer = require('multer')

const common = require("../common");
const pathes = common.pathes;
var Base = require(pathes.pathMW + "middleware_module_base");
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const FileFolderHandler = require(pathes.pathCore + 'disk_visitor');

var upload = multer({ dest: pathes.pathUpload });
//var uploadImg = upload.single('avatar').array("photos", 12);
//var uploadImg = upload.array("photos", 12);
var uploadImg = upload.single("file");

class ModuleUpload extends Base {
  constructor() {
    super();
    this.uploader = pathes.pathTemplate + "template_uploader.ejs";
  };

  GetHandler(req, res) {
    this.RenderEjs(req, res, this.uploader, {});
  };

  PostHandler(req, res) {
    //console.log(postData);
    uploadImg(req, res, (req, res) => {
      const postData = req.body;
      const file = req.file;

      // req.file is the `avatar` file
      // req.body will hold the text fields, if there were any

    });
  };
};

function Init() {
  let mw = new ModuleUpload();

  let get= function (req, res) {
    mw.GetHandler(req, res);
  };

  let post= function (req, res) {
    mw.PostHandler(req, res);
  };

  return { get: get, post: post };
};

module.exports.Init = Init;
