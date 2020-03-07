const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const common = require("../common");
const pathes = common.pathes;
const LOG = require(pathes.pathCore + 'logger');
const MWView = require(pathes.pathMW + "middleware_module_view");
const MWLogin = require(pathes.pathMW + "middleware_module_login");
const MWUpload = require(pathes.pathMW + "middleware_module_upload");
const MWEdit = require(pathes.pathMW + "middleware_module_edit");
const MWManage = require(pathes.pathMW + "middleware_module_manage");

function Init(app) {
  LOG.Info("middleware market Init()");
  var urlencodedParser = bodyParser.urlencoded({ extended: false, limit: "1mb" })
  var MiddlewareView = MWView.Init();
  var MiddlewareLogin = MWLogin.Init();
  var MiddlewareEdit = MWEdit.Init();
  //var MiddlewareUpload = MWUpload.Init();
  var MiddlewareManage = MWManage.Init();

  app.use(cookieParser('singedMyCookie'));
  app.get("/login", MiddlewareLogin.get);
  app.post("/login", urlencodedParser, MiddlewareLogin.post);
  app.get("/view", MiddlewareView.get);
  app.get("/edit", MiddlewareEdit.get);
  app.post("/edit", urlencodedParser, MiddlewareEdit.post);
  //app.get("/upload", MiddlewareUpload.get);
  //app.post("/upload", MiddlewareUpload.post);
  app.get("/manage", MiddlewareManage.get);
  app.get("/gallery", MiddlewareView.getGallery);
  app.get("/index.html", MiddlewareView.getFrontPage);
  app.get("/index", MiddlewareView.getFrontPage)
  app.get("/", MiddlewareView.getFrontPage);
}

module.exports = Init;
