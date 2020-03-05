const common = require("../common");
const pathes = common.pathes;
var Base = require(pathes.pathMW + "middleware_module_base");
const LOG = require(pathes.pathJS+'debug_logger');
const Utils = require(pathes.pathJS+"utils");
const UserManager = require(pathes.pathJS+"user_manager");
const FileFolderHandler = require(pathes.pathJS+'file_folder_handler');
const aco = require(pathes.pathJS + "article_config_organizer");

class ModuleManage extends Base {
  constructor() {
    super();
  };


  RebuildSummary(req, res) {
    let _obj = Object.create(null);
    _obj.contentBefore = FileFolderHandler.ReadFileUTF8(pathes.urlArticleConfig);
    _obj.articleCountBefore = aco.GetArticleCount();

    let _list = FileFolderHandler.ReadAllFileNamesInFolder(pathes.pathArticle);
    _list.map(_n => {
      if (_n != ".summary.json"){
        aco.Add(_n, "default", "<no title assigned>", null, false);
      }
    });
    aco.SaveConfigToDisk();

    _obj.contentAfter = FileFolderHandler.ReadFileUTF8(pathes.urlArticleConfig);
    _obj.articleCountAfter = aco.GetArticleCount();
    this.RenderEjs(req, res, pathes.templateManageRebuildSummary, { obj: _obj });
  };

  ListCategories(req, res) {
    let _cfgC = aco.GetCategories();
    let _obj = Object.create(null);
    _obj.arrCategoryName = [];
    for (let c in _cfgC){
      _obj.arrCategoryName.push(c);
    }
    this.RenderEjs(req, res, pathes.templateManageListCategoryName, { obj: _obj });
  };

  PostHandler(req, res) {
  };
};

function Init() {
  let mw = new ModuleManage();

  let get = function (req, res) {
    let _cmd = Utils.GetQueryValueOfCMD(req);
    switch(_cmd){
      case "rebuildSummary":
        mw.RebuildSummary(req, res);
        break;
      case "listCategories":
        mw.ListCategories(req, res);
        break;
      default:
        mw.RenderEjs(req, res, pathes.templateManage, {});
        break;
    }
  };
  let post = function (req, res) {
    res.end("bad request.");
  };

  return { get: get, post: post };
};

module.exports.Init = Init;
