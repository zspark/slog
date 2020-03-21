const common = require("../common");
const pathes = common.pathes;
const constant = common.constant;
var Base = require(pathes.pathMW + "middleware_module_base");
const LOG = require(pathes.pathCore+'logger');
const Utils = require(pathes.pathCore+"utils");
const UserManager = require(pathes.pathCore+"user_manager");
const DV = require(pathes.pathCore+'disk_visitor');
const CC = require(pathes.pathCore + "content_controller");

class ModuleManage extends Base {
  constructor() {
    super();
    this.templateManage = pathes.pathTemplate + "manage/template_manage.ejs";
    this.templateManageRebuildSummary = pathes.pathTemplate + "manage/template_manage_rebuild_summary.ejs";
    this.templateManageListCategoryName = pathes.pathTemplate + "manage/template_manage_list_category_name.ejs";
  };


  _RebuildSummary(req, res) {
    let _obj = Object.create(null);
    _obj.contentBefore = DV.ReadFileUTF8(pathes.urlArticleConfig);
    _obj.articleCountBefore = CC.GetArticleCount();

    let _list = DV.ReadAllFileNamesInFolder(pathes.pathArticle);
    _list.map(_n => {
      if (_n != ".summary.json"){
        CC.Add(_n, "_rebuild_collected_", "<no title assigned>", "<anonymous>", null, null, false);
      }
    });
    CC.SaveConfigToDisk();

    _obj.contentAfter = DV.ReadFileUTF8(pathes.urlArticleConfig);
    _obj.articleCountAfter = CC.GetArticleCount();
    this.RenderEjs(req, res, this.templateManageRebuildSummary, { obj: _obj });
  };

  _ListCategories(req, res) {
    let _cfgC = CC.GetCategories();
    let _obj = Object.create(null);
    _obj.arrCategoryName = [];
    for (let c in _cfgC){
      _obj.arrCategoryName.push(c);
    }
    this.RenderEjs(req, res, this.templateManageListCategoryName, { obj: _obj });
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
        this.RenderEjs(req, res, this.templateManage, {});
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
