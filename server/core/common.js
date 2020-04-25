const ROOT = __dirname + "/../../";// blog's root
const ROOT_SERVER = ROOT + "server/";
const ROOT_CLIENT = ROOT + "client/";
const ROOT_CONTENT = ROOT_CLIENT + "content/";
const ROOT_TEMPLATE = ROOT_SERVER + "template/";

const pathes = {
  pathRoot: ROOT,
  pathClient: ROOT_CLIENT,
  pathContent: ROOT_CONTENT,
  pathUpload: ROOT_CONTENT + "share/",
  pathGallery: ROOT_CONTENT + "share/gallery/",

  pathArticle: ROOT_CONTENT + "article/article/",
  urlArticleConfig: ROOT_CONTENT + "article/.summary.json",
  urlHistoryConfig: ROOT_CONTENT + "article/.history.json",

  pathUser: ROOT_SERVER + "user/",
  pathCore: ROOT_SERVER + "core/",
  pathMW: ROOT_SERVER + "middleware/",
  urlUsersConfig: ROOT_SERVER + "users.json",

  pathTemplate: ROOT_TEMPLATE,
};

const constant = {
  M_HOME: "home",
  M_GALLERY: "gallery",
  M_ARTICLE: "articles",
  M_ARTICLES: "articles",
  M_LOGGED_IN: "loggedIn",
  M_CONTENT: "content",
  M_TEMPLATE_OPTIONS: "templateOptions",
  M_FILE_NAME: "fileName",
  M_AUTHOR: "author",
  M_TEMPLATE: "template",
  M_LAYOUT: "layout",
  M_ALLOW_HISTORY: "allowHistory",
  M_SECRET: "secret",
  M_STYLE: "style",
  M_TITLE: "title",
  M_TIME: "time",
  M_CREATE_TIME: "createTime",
  M_MODIFY_TIME: "modifyTime",

  M_COMMAND: "command",
  M_COMMAND_REBUILD_SUMMARY: "rebuildSummary",
  M_COMMAND_LIST_CATEGORIES: "listCategories",

  M_ACTION: "action",
  M_ACTION_NEW: "new",
  M_ACTION_DELETE: "deleted",
  M_ACTION_MODIFIED: "modified",

  M_MODULE: "module",
  M_MODULE_EDIT: "edit",
  M_MODULE_VIEW: "view",
  M_MODULE_MANAGE: "manage",
  M_MODULE_LOGIN: "login",
  M_MODULE_UPLOAD: "upload",

  M_HISTORY: "history",

  M_CATEGORY: "category",
  M_CATEGORY_DEFAULT: "default",
  M_CATEGORY_CG: "CG",
  M_CATEGORY_PHILOSOPHY: "philosophy",
  M_CATEGORY_MATH: "math",
  M_CATEGORY_LANGUAGE: "language",

  M_ACCOUNT_DISPLAY_NAME: "displayName",

  M_TEMPLATE_DEFAULT: "default",
  M_TEMPLATE_DEFAULT_NO_TITLE: "default_no_title",
  M_TEMPLATE_FULLSCREEN: "fullscreen",
  M_TEMPLATE_FULLSCREEN_NO_TITLE: "fullscreen_no_title",
  M_TEMPLATE_LIST: [
    "default",
    "default_no_title",
    "fullscreen",
    "fullscreen_no_title",
  ],

  error_code: {
    UNKNOWN: 10000,
    REQUESTING_FORMAT_ERROR:10001,
    NO_FILE_NAME: 10002,
    SERVER_SHUT_DOWN: 10003,
    WRONG_ACCOUNT: 10004,
    WRONG_PWD: 10005,
  },

  action_code: {
    HEART_BEAT: 0,
    SAVE: 1,
    SAVE_AND_EXIT: 2,
    DELETE: 10,
    CANCEL: 20,
    LOGIN: 100,
    UPLOAD:1000,
    ACTION_CONFIRMED: 5000,
    FILE_EXIST:5100,
  },
};

module.exports.pathes = pathes;
module.exports.constant = constant;
