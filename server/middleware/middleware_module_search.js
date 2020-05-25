const common = require("../core/common");
const pathes = common.pathes;
const constant = common.constant;
var Base = require(pathes.pathMW + "middleware_module_base");
const ArticleHandler = require(pathes.pathCore + "article_handler");
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const UserManager = require(pathes.pathCore + "user_manager");
const TPLGEN = require(pathes.pathLayout + "template_generator");

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
    ArticleHandler.Search(_jsonObj.content, _obj);
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
