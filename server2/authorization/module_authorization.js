const Result = require("../core/basic").Result;
const DataCache = require("../logic/module_data_cache");
const UserManager = require("../core/user_manager");
const SessionManager = require("../core/session_manager");

class Authority {
    constructor() {
        this.CreateArticle = null;// a function to read;
        this.DeleteArticleSelf = null;
        this.DeleteArticleOthers = null;
        this.FetchArticleContent = null;
        this.GetArticle = null;
        this.FetchArticleListByTagName = null;
        this.ModifyArticleSelf = null;
        this.ModifyArticleOthers = null;
        this.SearchContent = null;
        this.FetchHistory = null;
        this.accountID = "";
    }
}

let NotAuthorized = function () {
    return Result.NOT_AUTHORIZED;
}
let CreateArticle = function (fileName, out) {
}
let DeleteArticleSelf = function (fileName, out) {
}
let DeleteArticleOthers = function (fileName, out) {
}
let ModifyArticleSelf = function (fileName, out) {
}
let ModifyArticleOthers = function (fileName, out) {
}
let GetArticle = function (fileName, out) {
    let ret = DataCache.GetArticle(fileName, out);
    if (ret > 0) {
        out.data = out.data.CreateArticleProxy();
    }
    return ret;
}
let GetArticleToEdit = function (fileName, out) {
    let _sid = SessionManager.CreateSession();
    let ret = DataCache.GetArticle(fileName, out);
    if (ret > 0) {
        out.data = out.data.CreateArticleProxy();
    }
    return ret;
}
let FetchArticleContent = function (fileName, out) {
    let _a = DataCache.GetArticle(fileName);
    if (_a) {
        _a.ReadContent(out);
        return Result.OK;
    } else {
        out.msg = `article NOT exist`;
        return Result.ARTICLE_NOT_EXIST;
    }
}
let FetchArticleListByTagName = function (tagName, out) {
    let ret = DataCache.GetTag(tagName, out);
    if (ret > 0) {
        out.data = out.data.CreateTagProxy();
    }
    return ret;
}
let SearchContent = function (fileName, out) {
    return DataCache.Search(fileName, out);
}
let FetchHistory = function (out) {
    return DataCache.GetHistory(out);
}
module.exports.GetAuthority = function (req, out) {
    let _account = "account";
    const _data = req.body;
    if (_data) {
        _account = _data["account"];
    }
    const ret = UserManager.GetAccountPrivilege(_account, out);
    if (ret == Result.ACCOUNT_NOT_EXIST) {
        out.data = UserManager.GetVisitorPrivilege();
    }
    const _privilege = out.data;

    let _au = new Authority();
    _au.CreateArticle = _privilege.allowCreate ? CreateArticle : NotAuthorized;
    _au.DeleteArticleSelf = _privilege.allowDeleteSelf ? DeleteArticleSelf : NotAuthorized;
    _au.DeleteArticleOthers = _privilege.allowDeleteOthers ? DeleteArticleOthers : NotAuthorized;
    _au.ModifyArticleSelf = _privilege.allowModifySelf ? ModifyArticleSelf : NotAuthorized;
    _au.ModifyArticleOthers = _privilege.allowModifyOthers ? ModifyArticleOthers : NotAuthorized;
    _au.FetchArticleContent = _privilege.allowView ? FetchArticleContent : NotAuthorized;
    _au.GetArticle = _privilege.allowView ? GetArticle : NotAuthorized;
    _au.FetchArticleListByTagName = _privilege.allowView ? FetchArticleListByTagName : NotAuthorized;
    _au.SearchContent = _privilege.allowSearch ? SearchContent : NotAuthorized;
    _au.FetchHistory = _privilege.allowReadingHistory ? FetchHistory : NotAuthorized;
    _au.accountID = _account;
    out.data = _au;
    return ret;
}
