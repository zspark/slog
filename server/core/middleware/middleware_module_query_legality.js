const common = require("../common");
const pathes = common.pathes;
const constant = common.constant;
var Base = require(pathes.pathMW + "middleware_module_base");
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const UserManager = require(pathes.pathCore + "user_manager");

class ModuleQueryLegality extends Base {
  constructor() {
    super();
    this.illegalFileNameEJS = pathes.pathTemplate + "template_illegal_file_name.ejs";
  };

  ComposeIllegalFileName(req, res) {
    this.RenderEjs(req, res, this.illegalFileNameEJS, {});
  }
};

function Init() {
  let mw = new ModuleQueryLegality();

  let use = function (req, res, next) {
    const _q = Utils.GetQueryValues(req);
    const _fileName = _q[constant.M_FILE_NAME];
    if (_fileName) {
      if (!Utils.CheckFileNameLegality(_fileName)) {
        mw.ComposeIllegalFileName(req, res);
        return;
      }
    }
    next();
  };

  return { use: use };
};

module.exports.Init = Init;
