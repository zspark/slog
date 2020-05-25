const common = require("../core/common");
const pathes = common.pathes;
const constant = common.constant;
var Base = require(pathes.pathMW + "middleware_module_base");
const LOG = require(pathes.pathCore+'logger');
const Utils = require(pathes.pathCore+"utils");
const UserManager = require(pathes.pathCore+"user_manager");
const IOSystem = require(pathes.pathCore+'io_system');
const ArticleHandler = require(pathes.pathCore + "article_handler");
const TPLGEN = require(pathes.pathLayout + "template_generator");

class ModuleManage extends Base {
  constructor() {
    super();
  };

  _RebuildSummary(req, res) {
    let _obj = Object.create(null);
    _obj.contentBefore = IOSystem.ReadFileUTF8(pathes.urlArticleConfig);
    _obj.articleCountBefore = ArticleHandler.GetArticleCount();

    let _list = IOSystem.ReadAllFileNamesInFolder(pathes.pathArticle);
    _list.map(_n => {
      if (_n != ".summary.json"){
        ArticleHandler.Add(_n, "_rebuild_collected_", "<no title assigned>", "<anonymous>", null, null, false);
      }
    });
    ArticleHandler._SaveConfigToDisk();

    _obj.contentAfter = IOSystem.ReadFileUTF8(pathes.urlArticleConfig);
    _obj.articleCountAfter = ArticleHandler.GetArticleCount();

    let _html = TPLGEN.GenerateHTMLRebuildSummay(_obj.articleCountBefore, _obj.contentBefore, _obj.articleCountAfter, _obj.contentAfter);
    res.end(_html);
  };

  _ListCategories(req, res) {
    let _cfgC = ArticleHandler.GetCategories();
    let _arrList = [];
    for (let c in _cfgC){
      _arrList.push(c);
    }
    let _html = TPLGEN.GenerateHTMLListCategory(_arrList);
    res.end(_html);
  };

  GetHandler(req, res) {
    let _cmd = req.query.cmd;
    switch (_cmd) {
      case constant.M_COMMAND_REBUILD_SUMMARY:
        this._RebuildSummary(req, res);
        break;
      case constant.M_COMMAND_LIST_CATEGORIES:
        this._ListCategories(req, res);
        break;
      default:
        let _html = TPLGEN.GenerateHTMLManage();
        res.end(_html);
        break;
    }
  };

  PostHandler(req, res) {
  };
};

function Init() {
  let mw = new ModuleManage();

  let get = function (req, res) {
    let _loggedIn = Utils.CheckLogin(req);
    if (!_loggedIn) {
      let _url = Utils.MakeLoginURL();
      res.redirect(_url)
      return;
    }

    mw.GetHandler(req, res);
  };

  let post = function (req, res) {
    res.end("bad request.");
  };

  return { get: get, post: post };
};

module.exports.Init = Init;
