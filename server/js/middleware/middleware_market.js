const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const pathes = require("../pathes");
const ArticleComposer = require(pathes.pathMW + "mw_composer_article");
const IndexComposer = require(pathes.pathMW + "mw_composer_index");
const LoginComposer = require(pathes.pathMW + "mw_composer_login");
const EditorComposer = require(pathes.pathMW + "mw_composer_editor");
const GalleryComposer = require(pathes.pathMW + "mw_composer_gallery");
const ProjectComposer = require(pathes.pathMW + "mw_composer_project");
const CodeViewerComposer = require(pathes.pathMW + "mw_composer_code_viewer");

var bInited = false;
function Init(app) {
  if (!bInited) {
    bInited = true;
    var urlencodedParser = bodyParser.urlencoded({ extended: false, limit: "1mb" })
    var Article = ArticleComposer.ArticleHtmlComposer();
    var Index = IndexComposer.IndexHtmlComposer();
    var Login = LoginComposer.LoginHtmlComposer();
    var Editor = EditorComposer.EditorHtmlComposer();
    var Gallery = GalleryComposer.GalleryHtmlComposer();
    var Project = ProjectComposer.ProjectHtmlComposer();
    var CodeViewer = CodeViewerComposer.CodeViewerHtmlComposer();

    app.use(cookieParser('singedMyCookie'));
    app.get("/login", Login);
    app.post("/login", urlencodedParser, Login);
    app.get("/article/", Article.get);
    app.get("/editor/", Editor.get);
    app.post("/editor/", urlencodedParser, Editor.post);
    app.get("/gallery/", Gallery);
    app.get("/project/", Project);
    app.get("/codeview/", CodeViewer.get);
    app.get("/index.html", Index);
    app.get("/index", Index)
    app.get("/", Index);
  } else {
    //TODO:Jerry: error msg.
  }
}

module.exports = Init;
