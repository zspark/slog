const ROOT = __dirname + "/../../";// blog's root
const ROOT_SERVER = ROOT + "server/";
const ROOT_CLIENT = ROOT + "client/";
const ROOT_CONTENT = ROOT + "server/content/";
const ROOT_TEMPLATE = ROOT + "server/template/";

const pathes = {
  pathRoot: ROOT,
  pathClient: ROOT_CLIENT,
  pathUpload: ROOT_CLIENT + "share/",
  pathGallery: ROOT_CLIENT + "share/gallery/",

  pathArticle: ROOT_CONTENT + "article/",
  urlArticleConfig: ROOT_CONTENT + ".summary.json",

  pathUser: ROOT_SERVER + "user/",
  pathCore: ROOT_SERVER + "core/",
  pathMW: ROOT_SERVER + "core/middleware/",
  urlUsersConfig: ROOT_SERVER + "users.json",

  pathTemplate: ROOT_TEMPLATE,
};

const constant = {
  M_HOME: "home",
  M_GALLERY: "gallery",
  M_ARTICLE: "articles",
  M_LOGGED_IN: "loggedIn",
  M_CONTENT: "content",
  M_FILE_NAME: "fileName",
  M_AUTHOR: "author",
  M_TEMPLATE: "template",
  M_TITLE: "title",
  M_CREATE_TIME: "createTime",
  M_MODIFY_TIME: "modifyTime",

  M_COMMAND: "command",
  M_COMMAND_REBUILD_SUMMARY: "rebuildSummary",
  M_COMMAND_LIST_CATEGORIES: "listCategories",

  M_MODULE: "module",
  M_MODULE_EDIT: "edit",
  M_MODULE_VIEW: "view",
  M_MODULE_MANAGE: "manage",
  M_MODULE_LOGIN: "login",
  M_MODULE_UPLOAD: "upload",

  M_CATEGORY: "category",
  M_CATEGORY_DEFAULT: "default",
  M_CATEGORY_CG: "CG",
  M_CATEGORY_PHILOSOPHY: "philosophy",
  M_CATEGORY_MATH: "math",
  M_CATEGORY_LANGUAGE: "language",

  M_ACCOUNT_DISPLAY_NAME: "displayName",
};

module.exports.pathes = pathes;
module.exports.constant = constant;
