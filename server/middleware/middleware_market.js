const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const common = require("../core/common");
const pathes = common.pathes;
const LOG = require(pathes.pathCore + 'logger');
const MWView = require(pathes.pathMW + "middleware_module_view");
const MWLogin = require(pathes.pathMW + "middleware_module_login");
const MWUpload = require(pathes.pathMW + "middleware_module_upload");
const MWSearch = require(pathes.pathMW + "middleware_module_search");
const MWEdit = require(pathes.pathMW + "middleware_module_edit");
const MWManage = require(pathes.pathMW + "middleware_module_manage");
const MWQueryLegality = require(pathes.pathMW + "middleware_module_query_legality");

function Init(app) {
  LOG.Info("middleware market Init()");
  var MiddlewareView = MWView.Init();
  var MiddlewareLogin = MWLogin.Init();
  var MiddlewareEdit = MWEdit.Init();
  var MiddlewareUpload = MWUpload.Init();
  var MiddlewareManage = MWManage.Init();
  var MiddlewareSearch = MWSearch.Init();
  var MiddlewareQueryLegality = MWQueryLegality.Init();

  app.use(MiddlewareQueryLegality.use);
  app.use(cookieParser('singedMyCookie'));
  app.get("/login", MiddlewareLogin.get);
  app.post("/login", bodyParser.json({ extended: false, limit: "1kb" }), MiddlewareLogin.post);
  app.get("/view", MiddlewareView.get);
  app.get("/edit", MiddlewareEdit.get);
  app.get("/edit/previewHtml", MiddlewareEdit.getPreviewHtml);
  app.post("/edit", bodyParser.json({ extended: false, limit: "1mb" }), MiddlewareEdit.post);
  app.get("/search", MiddlewareSearch.get);
  app.post("/search", bodyParser.json({ extended: false, limit: "1mb" }), MiddlewareSearch.post);
  //app.get("/upload", MiddlewareUpload.get);
  app.post("/upload", bodyParser.urlencoded({ extended: false, limit: "2mb" }), MiddlewareUpload.post);
  app.get("/manage", MiddlewareManage.get);
  app.get("/gallery", MiddlewareView.getGallery);
  app.get("/history", MiddlewareView.getHistory);
  app.get("/index.html", MiddlewareView.getFrontPage);
  app.get("/index", MiddlewareView.getFrontPage)
  app.get("/", MiddlewareView.getFrontPage);
}

module.exports = Init;
