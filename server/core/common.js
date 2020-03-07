const ROOT = __dirname + "/../../";// blog's root
const ROOT_SERVER = ROOT + "server/";
const ROOT_CLIENT = ROOT + "client/";
const ROOT_CONTENT = ROOT + "server/content/";
const ROOT_TEMPLATE = ROOT + "server/template/";

const pathes = {
  pathRoot: ROOT,
  pathClient: ROOT_CLIENT,
  pathGallery: ROOT_CLIENT + "share/gallery/",

  pathCode: ROOT_CONTENT + "code/",
  pathArticle: ROOT_CONTENT + "article/",
  urlArticleConfig: ROOT_CONTENT + "article/.summary.json",

  pathUser: ROOT_SERVER + "user/",
  pathCore: ROOT_SERVER + "core/",
  pathMW: ROOT_SERVER + "core/middleware/",
  urlUsersConfig: ROOT_SERVER + "users.json",

  pathTemplate: ROOT_TEMPLATE,
  templateManage: ROOT_TEMPLATE + "manage/template_manage.ejs",
  templateManageRebuildSummary: ROOT_TEMPLATE + "manage/template_manage_rebuild_summary.ejs",
  templateManageListCategoryName: ROOT_TEMPLATE + "manage/template_manage_list_category_name.ejs"
};

const constant = {
  M_HOME: "home",
  M_GALLERY: "gallery",
  M_ARTICLE: "articles",
  M_LOGGED_IN: "loggedIn",
  M_FILE_NAME: "fileName",
  M_CATEGORY: "category",
  M_AUTHOR: "author",
  M_TEMPLATE: "template",
  M_TITLE: "title",
  M_CREATE_TIME: "createTime",
  M_MODIFY_TIME: "modifyTime",
};

module.exports.pathes = pathes;
module.exports.constant = constant;
