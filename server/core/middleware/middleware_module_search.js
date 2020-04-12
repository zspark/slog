const common = require("../common");
const pathes = common.pathes;
const constant = common.constant;
var Base = require(pathes.pathMW + "middleware_module_base");
const CC = require(pathes.pathCore + "content_controller");
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const UserManager = require(pathes.pathCore + "user_manager");
const TPLGEN = require(pathes.pathCore + "template_generator");

class ModuleSearch extends Base {
  constructor() {
    super();
  };

  GetHandler(req, res) {
    let _html = TPLGEN.GenerateHTMLSearch();
    res.end(_html);
  }

  PostHandler(req, res) {
    let _jsonObj = req.body;
    let _obj = [];
    /*
      _obj=
      [
        {fileName:"xxx",content:"sfsfsf"},// content for show ,fileName for link
        {fileName:"xxx",content:"sfsfsf"}
      ]
     */
    CC.Search(_jsonObj.content, _obj);
    let _html = TPLGEN.GenerateHTMLSearchContent(_obj);
    res.end(_html);
  }
};

function Init() {
  let mw = new ModuleSearch();

  let get = function (req, res) {
    mw.GetHandler(req, res);
  };

  let post = function (req, res) {
    mw.PostHandler(req, res);
  };

  return { get: get, post: post };
};

module.exports.Init = Init;
