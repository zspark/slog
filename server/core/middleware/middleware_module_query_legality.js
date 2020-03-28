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
  };

  ComposeIllegalFileName(req, res) {
    this.ComposeInfoboard(req, res, `You have typed a illegal file name!`);
  }
};

function Init() {
  let mw = new ModuleQueryLegality();

  let use = function (req, res, next) {
    const _fileName = req.query.n;
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
