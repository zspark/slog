const ROOT = __dirname + "/../../";// blog's root
const ROOT_client = ROOT + "client/";
const ROOT_server = ROOT + "server/";
const ROOT_dynamic = ROOT_client + "dynamic/";
const ROOT_static = ROOT_client + "static/";
const ROOT_TEMPLATE = ROOT_server + "template/";

const pathes = {
  pathRoot: ROOT,
  pathStatic: ROOT_static,
  pathGallery: ROOT_static + "share/gallery/",

  pathCode: ROOT_dynamic + "code/",
  pathArticle: ROOT_dynamic + "article/",
  urlArticleConfig: ROOT_dynamic + "article/.summary.json",

  pathUser: ROOT_server + "user/",
  pathJS: ROOT_server + "js/",
  pathMW: ROOT_server + "js/middleware/",

  pathTemplate: ROOT_TEMPLATE,
  templateManage: ROOT_TEMPLATE + "manage/template_manage.ejs",
  templateManageRebuildSummary: ROOT_TEMPLATE + "manage/template_manage_rebuild_summary.ejs",
  templateManageListCategoryName: ROOT_TEMPLATE + "manage/template_manage_list_category_name.ejs"
};

const constant = {
  M_CATEGORY: "category",
  M_ARTICLE: "articles"
};

module.exports.pathes = pathes;
module.exports.constant = constant;
