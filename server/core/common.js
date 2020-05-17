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
    M_DEFAULT_FILE_NAME: "no-file-name",
    M_DEFAULT_TITLE: "no-title",
    M_DEFAULT_AUTHOR: "anonymous",
    M_DEFAULT_CATEGORY_NAME: "default",
    M_DEFAULT_PARSER: "marked",

    M_COMMAND: "command",
    M_COMMAND_REBUILD_SUMMARY: "rebuildSummary",
    M_COMMAND_LIST_CATEGORIES: "listCategories",

    M_ACTION: "action",
    action_string: {
        UNKNOWN: "unknown",
        NEW: "new",
        DELETE: "deleted",
        MODIFIED: "modified",
    },

    M_MODULE: "module",
    M_MODULE_EDIT: "edit",
    M_MODULE_VIEW: "view",
    M_MODULE_MANAGE: "manage",
    M_MODULE_LOGIN: "login",
    M_MODULE_UPLOAD: "upload",

    M_HISTORY: "history",

    M_CATEGORY: "category",
    M_CATEGORY_NAME: "categoryName",
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
        REQUESTING_FORMAT_ERROR: 10001,
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
        UPLOAD: 1000,
        ACTION_CONFIRMED: 5000,
        FILE_EXIST: 5100,
    },

    authorization: {
        FULL_AUTHORIZED: 1,/// administrator
        CREATOR_ONLY:2,/// one can only editing self post;
    },

    authorization: {
        FULL_AUTHORIZED: 1,/// administrator
        CREATOR_ONLY:2,/// one can only editing self post;
    },
};

module.exports.pathes = pathes;
module.exports.constant = constant;
