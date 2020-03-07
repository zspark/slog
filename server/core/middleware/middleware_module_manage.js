const common = require("../common");
const pathes = common.pathes;
var Base = require(pathes.pathMW + "middleware_module_base");
const LOG = require(pathes.pathCore+'logger');
const Utils = require(pathes.pathCore+"utils");
const UserManager = require(pathes.pathCore+"user_manager");
const FileFolderHandler = require(pathes.pathCore+'disk_visitor');
const CC = require(pathes.pathCore + "content_controller");

class ModuleManage extends Base {
  constructor() {
    super();
  };


  RebuildSummary(req, res) {
    let _obj = Object.create(null);
    _obj.contentBefore = FileFolderHandler.ReadFileUTF8(pathes.urlArticleConfig);
    _obj.articleCountBefore = CC.GetArticleCount();

    let _list = FileFolderHandler.ReadAllFileNamesInFolder(pathes.pathArticle);
    _list.map(_n => {
      if (_n != ".summary.json"){
        CC.Add(_n, "default", "<no title assigned>", null, null, null, false);
      }
    });
    CC.SaveConfigToDisk();

    _obj.contentAfter = FileFolderHandler.ReadFileUTF8(pathes.urlArticleConfig);
    _obj.articleCountAfter = CC.GetArticleCount();
    this.RenderEjs(req, res, pathes.templateManageRebuildSummary, { obj: _obj });
  };

  ListCategories(req, res) {
    let _cfgC = CC.GetCategories();
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
