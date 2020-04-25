const common = require("../core/common");
const pathes = common.pathes;
const constant = common.constant;
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const ArticleHandler = require(pathes.pathCore + "article_handler");
const IOSystem = require(pathes.pathCore + "io_system");
const TPLGEN = require(pathes.pathCore + "template_generator");

class ArticleConfig {

    #fileName;
    #title;
    #createTime;
    #modifyTime;
    #author;
    #category;
    #template;
    #allowHistory;
    #secret;

    constructor(fileName, obj) {
        this.#fileName = obj ? obj[constant.M_FILE_NAME] : fileName;
        this.#title = obj ? obj[constant.M_TITLE] : "<no-title>";
        this.#createTime = obj ? obj[constant.M_CREATE_TIME] : new Date().toISOString();
        this.#modifyTime = new Date().toISOString();
        this.#author = obj ? obj[constant.M_AUTHOR] : "anonymous";
        this.#category = obj ? obj[constant.M_CATEGORY] : "default";
        this.#template = obj ? obj[constant.M_TEMPLATE] : constant.M_TEMPLATE_DEFAULT;
        this.#allowHistory = obj ? obj[constant.M_ALLOW_HISTORY] : true;
        this.#secret = false;
    }

    ToObject() {
        let _obj = {
            fileName: this.#fileName,
            title: this.#title,
            createTime: this.#createTime,
            modifyTime: this.#modifyTime,
            author: this.#author,
            category: this.#category,
            template: this.#template,
            allowHistory: this.#allowHistory,
            secret: this.#secret,
        };
        return _obj;
    }


    /*
    Modify(fileName, category, title, author, template, allowHistory) {
        if (fileName != null) this.#fileName = fileName;
        if (category != null) this.#category = category;
        if (title != null) this.#title = title;
        if (author != null) this.#author = author;
        if (template != null) this.#template = template;
        if (allowHistory != null) this.#allowHistory = allowHistory;
    }
    */


    GetTitle() { return this.#title; }
    SetTitle(title) { this.#title = title; }
    SetAuthor(author) { this.#author = author; }
    GetAuthor() { return this.#author; }
    GetFileName() { return this.#fileName; }
    SetCategory(category) { this.#category = category; }
    GetCategory() { return this.#category; }
    SetLayout(layout) { this.#template = layout; }
    GetLayout() { return this.#template; }
    SetAllowHistory(b) { this.#allowHistory = b; }
    GetAllowHistory() { return this.#allowHistory; }
    SetSecret(b) { this.#secret = b; }
    GetSecret() { return this.#secret; }

};

if (IOSystem.FileExist(pathes.urlArticleConfig)) {
    let _data = IOSystem.ReadFileUTF8(pathes.urlArticleConfig);
    let _configJson = JSON.parse(_data);
    let _obj = _configJson[constant.M_ARTICLES];

    let newObj = {
        "version": "1.0.0",
        "articles": [],
    };
    for (var name in _obj) {
        let _ac = new ArticleConfig("<no-file-name>", _obj[name]);
        let _acObj = _ac.ToObject();
        newObj["articles"].push(_acObj);
    }

    IOSystem.WriteFileUTF8(pathes.pathCore + "aaa.json", JSON.stringify(newObj));
}