const ROOT = __dirname + "/../../";// blog's root
const ROOT_client = ROOT + "client/";
const ROOT_server = ROOT + "server/";
//const CACHE_ARTICLE_URL = ROOT + "/cache-article.json";
const ROOT_dynamic = ROOT_client + "dynamic/";
const ROOT_static = ROOT_client + "static/";
const ROOT_USER = ROOT_server + "user/";
const ROOT_TEMPLATE = ROOT_server + "template/";
const ROOT_JS = ROOT_server + "js/";
const ROOT_MW = ROOT_JS + "middleware/";
const ROOT_gallery = ROOT_static + "share/gallery/";

var pathes = {
  pathRoot: ROOT,
  pathStatic: ROOT_static,
  pathUser: ROOT_USER,
  pathJS: ROOT_JS,
  pathMW: ROOT_MW,
  pathGallery: ROOT_gallery,
  pathTemplate: ROOT_TEMPLATE,
  pathCode: ROOT_dynamic + "code/",
  pathArticle: ROOT_dynamic + "article/",
  urlArticleConfig: ROOT_dynamic + "article/.summary.json"
};
module.exports = pathes;

  //LOG.Info("%s,%s", tplFolderPath, articleFolderPath);
