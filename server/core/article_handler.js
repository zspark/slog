const common = require("./common");
const pathes = common.pathes;
const constant = common.constant;
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const IOSystem = require(pathes.pathCore + 'io_system');

const default_config_json = {
    "version": "1.0.0",
    "content": [],
}

class Category {
    constructor(name) {
        this.categoryName = name;
        this._vecFileNames = [];
    }

    Add(fileName) {
        if (typeof fileName != "string") return false;
        let idx = this._vecFileNames.indexOf(fileName);
        if (idx >= 0) return false;
        this._vecFileNames.unshift(fileName);/// need to set at top for recent display.
        return true;
    }

    Remove(fileName) {
        if (typeof fileName != "string") return false;
        let idx = this._vecFileNames.indexOf(fileName);
        if (idx < 0) return false;
        this._vecFileNames.splice(idx, 1);
        return true;
    }

    Size() { return this._vecFileNames.length; }

    ForEachFileName(fn) {
        if (fn instanceof Function) {
            this._vecFileNames.forEach((e, i, v) => {
                fn(e);
            });
            return true;
        }
        return false;
    }
};

/**
 * we save using toISOString,
 * we display using toDateString,
 */
class History {
    constructor(v) {
        if (typeof v == "string") {
            this.fileName = v;
            this.title = constant.M_DEFAULT_TITLE;
            this.action = constant.action_string.UNKNOWN;
            this.time = new Date();
        } else if (v instanceof Object) {
            this.fileName = v.fileName;
            this.title = v.title;
            this.action = v.action;
            this.time = new Date(v.time);
        }else{ 
            LOG.Error(`Wrong constructor parameter!`);
        }
    }

    ToObject() {
        return JSON.parse(JSON.stringify(this));
    }

    GetFileName() { return this.fileName; }
    GetTitle() { return this.title; }
    SetTitle(v) { this.title = v; }
    GetAction() { return this.action; }
    SetAction(v) { this.action = v; }
    GetTime() { return this.time; }
    GetTimeString() { return this.time.toDateString(); }
    UpdateTime() {
        this.time = new Date(v);
    }
};

class Article {
    constructor(v, creatorAccount) {
        if (typeof v == "string" && typeof creatorAccount == "string") {
            this.FromObject(null);
            this.fileName = v;
            this.creatorAccount = creatorAccount;
        } else if (v instanceof Object) {
            this.FromObject(v);
        } else {
            LOG.Error(`Wrong constructor parameter!`);
        }
    }

    Clone() {
        let _tmp = new Article(this);
        return _tmp;
    }

    ToObject() {
        return JSON.parse(JSON.stringify(this));
    }

    FromObject(v) {
        this.fileName = v ? v.fileName : "";
        this.creatorAccount = v ? v.creatorAccount : "";
        this.title = v ? v.title : constant.M_DEFAULT_TITLE;
        this.createTime = v ? new Date(v.createTime) : new Date();
        this.modifyTime = v ? new Date(v.modifyTime) : new Date();
        this.author = v ? v.author : constant.M_DEFAULT_AUTHOR;
        this.category= v ? v.category : constant.M_DEFAULT_CATEGORY_NAME;
        this.layout = v ? v.layout : constant.M_TEMPLATE_DEFAULT;
        this.allowHistory = v ? v.allowHistory : true;
        this.secret = v ? v.secret : false;
        this.parser = null;
    }

    GetFileName() { return this.fileName; }
    GetTitle() { return this.title; }
    SetTitle(v) { this.title = v; }
    GetAuthor() { return this.author; }
    SetAuthor(v) { this.author = v; }
    GetCreatorAccount() { return this.creatorAccount; }
    GetCategoryName() { return this.category; }
    SetCategoryName(v) { this.category= v; }
    GetLayout() { return this.layout; }
    SetLayout(v) { this.layout = v; }
    GetAllowHistory() { return this.allowHistory; }
    SetAllowHistory(v) { this.allowHistory = v; }
    GetSecret() { return this.secret; }
    SetSecret(v) { this.secret = v; }
    GetCreateTime() { return this.createTime; }
    GetCreateTimeString() { return this.createTime.toDateString(); }
    GetModifyTime() { return this.modifyTime; }
    GetModifyTimeString() { return this.modifyTime.toDateString(); }
    GetContent() {
        let _content = IOSystem.ReadFileUTF8(pathes.pathArticle + this.fileName);
        return _content == null ? "" : _content;
    }
};

class ArticleHandler {
    constructor() {
        LOG.Info("[CONSTRUCT] article organizer...");
        this.m_mapArticle = new Map();
        this.m_mapCategory = new Map();
        this.m_arrayHistory = [];

        if (IOSystem.FileExist(pathes.urlArticleConfig)) {
            LOG.Info("read and parse article config...");
            let _configJson = JSON.parse(IOSystem.ReadFileUTF8(pathes.urlArticleConfig));
            let _arr = _configJson.content;

            const N = _arr.length;
            for (let i = 0; i < N; ++i) {
                let _ac = new Article(_arr[i]);
                this.m_mapArticle.set(_ac.GetFileName(), _ac);
                this._AppendToCategory(_ac.GetCategoryName(), _ac.GetFileName());
            }
        }

        if (IOSystem.FileExist(pathes.urlHistoryConfig)) {
            LOG.Info("read and parse history config...");
            let _configJson = JSON.parse(IOSystem.ReadFileUTF8(pathes.urlHistoryConfig));
            let _arr = _configJson.content;

            const N = _arr.length;
            for (let i = 0; i < N; ++i) {
                let _h = new History(_arr[i]);
                this.m_arrayHistory.push(_h);
            }
        }
    };

    _RemoveFromCategory(categoryName, fileName) {
        let _category = this.m_mapCategory.get(categoryName);
        if (!_category) return false;
        let _b=_category.Remove(fileName);
        if (_b){
            if (_category.Size() <= 0) this.m_mapCategory.delete(categoryName);
        }
        return _b;
    };

    _AppendToCategory(categoryName, fileName) {
        let _category = this.m_mapCategory.get(categoryName);
        if (!_category) {
            _category = new Category(categoryName);
            this.m_mapCategory.set(categoryName, _category);
        }
        return _category.Add(fileName);
    }

    _AppendToHistory(ac, action) {
        /// check last history
        if (this.m_arrayHistory.length > 0) {
            let _topElem = this.m_arrayHistory[0];
            if (ac.GetFileName() == _topElem.GetFileName()) {
                if (action == _topElem.GetAction()) {
                    _topElem.SetTime(new Date());
                    return true;
                }
            }
        }

        let _h = new History(ac.GetFileName());
        _h.SetTitle(ac.GetTitle());
        _h.SetAction(action);
        this.m_arrayHistory.unshift(_h);
        if (this.m_arrayHistory.length > 50) {
            this.m_arrayHistory.pop();
        }
        return true;
    }

    _SaveConfigToDisk(configs, url) {
        let _config = JSON.parse(JSON.stringify(default_config_json));// copy
        let _content = _config.content;
        configs.forEach((hc, i, arr) => {
            _content.push(hc.ToObject());
        });

        let _configStr = JSON.stringify(_config);
        var _b = IOSystem.WriteFileUTF8(url, _configStr);
        if (_b) {
            LOG.Info("save config to disk successfully.");
        } else {
            LOG.Error("save config to disk failed!");
        }
        return _b;
    }

    _DeleteArticleFromDisk(fileName) {
        let _b = IOSystem.DeleteFile(pathes.pathArticle + fileName);
        if (_b) {
            LOG.Info("article deleted, file name:%s", fileName);
        } else {
            LOG.Error("article deleting failed! file name:%s", fileName);
        }
        return _b;
    }

    _SaveArticleToDisk(fileName, content, cb) {
        var _b = IOSystem.WriteFileUTF8(pathes.pathArticle + fileName, content);
        if (_b) {
            LOG.Info("article saved successfully. file name:%s", fileName);
        } else {
            LOG.Error("article saving failure! file name:%s", fileName);
        }
        if (cb) cb(_b);
        return _b;
    }

    Add(ac, content) {
        if (!ac) return false;
        if (!ac instanceof Article) return false;

        const fileName = ac.GetFileName();
        if (this.HasConfig(fileName)) return false;

        let _articleConfig = ac.Clone();
        this.m_mapArticle.set(fileName, _articleConfig);
        this._AppendToCategory(_articleConfig.GetCategoryName(), fileName);

        this._SaveConfigToDisk(this.m_mapArticle,pathes.urlArticleConfig);
        this._SaveArticleToDisk(fileName, content);
        if (_articleConfig.GetAllowHistory()) {
            this._AppendToHistory(_articleConfig, constant.action_string.NEW);
            this._SaveConfigToDisk(this.m_arrayHistory,pathes.urlHistoryConfig);
        }
        return true;
    };

    Delete(ac) {
        if (!ac) return false;
        if (!ac instanceof Article) return false;

        const fileName = ac.GetFileName();
        if (!this.HasConfig(fileName)) return false;

        this._RemoveFromCategory(ac.GetCategoryName(), fileName);
        this.m_mapArticle.delete(fileName);
        this._SaveConfigToDisk(this.m_mapArticle,pathes.urlArticleConfig);
        this._DeleteArticleFromDisk(fileName);
        this._AppendToHistory(ac, constant.action_string.DELETE);
        this._SaveConfigToDisk(this.m_arrayHistory, pathes.urlHistoryConfig);
        return true;
    };

    Modify(ac, content) {
        if (!ac) return false;
        if (!ac instanceof Article) return false;

        const fileName = ac.GetFileName();
        if (!this.HasConfig(fileName)) return false;

        let _targetAc = this.m_mapArticle.get(fileName);
        const currentCategory = ac.GetCategoryName();
        const lastCategory = _targetAc.GetCategoryName();
        if (lastCategory != currentCategory) {
            this._RemoveFromCategory(lastCategory, fileName);
            this._AppendToCategory(currentCategory, fileName);
        }
        _targetAc.FromObject(ac);


        this._SaveConfigToDisk(this.m_mapArticle,pathes.urlArticleConfig);
        this._SaveArticleToDisk(fileName, content);
        if (_targetAc.GetAllowHistory()) {
            this._AppendToHistory(ac, constant.action_string.MODIFIED);
            this._SaveConfigToDisk(this.m_arrayHistory, pathes.urlHistoryConfig);
        }
        LOG.Info("article modified. file name:%s", fileName);
        return true;
    }

    Search(searchValue, out) {
        if (typeof searchValue != "string") return false;
        if (searchValue.length <= 0) return false;
        if (!(out instanceof Array)) return false;
        searchValue = searchValue.toLowerCase();

        let _arr = searchValue.split(/ +/);/// using / +/ to replace ' ' for multiply spaces. e.g. "aa bb cc       dd"
        const N = _arr.length;

        let _test = function (str, outRange) {
            str = str.toLowerCase();
            let i = 0;
            let fromIdx = 0;
            do {
                let offset = str.indexOf(_arr[i], fromIdx);
                if (offset < 0) {
                    return false;
                }
                outRange.push(offset, _arr[i].length);
                fromIdx = offset + _arr[i].length + 1; /// +1 : pass one space char.
                ++i;
            } while (i < N)
            return true;
        }

        this.m_mapArticle.forEach((_obj, k, m) => {
            let _range = [];

            if (_test(_obj.GetFileName(), _range)) {
                out.push({ fileName: _obj.GetFileName(), title: _obj.GetTitle(), range: _range, from: "name", author: _obj.GetAuthor() });
                return;
            }

            if (_test(_obj.GetTitle(), _range)) {
                out.push({ fileName: _obj.GetFileName(), title: _obj.GetTitle(), range: _range, from: "title", author: _obj.GetAuthor() });
            }
        });
        return true;
    }

    HasConfig(fileName) {
        return this.m_mapArticle.has(fileName);
    }

    GetConfig(fileName) {
        if (typeof fileName != "string") return null;
        let _ac = this.m_mapArticle.get(fileName);
        return _ac ? _ac.Clone() : null;
    }

    CreateArticleProxy(fileName, creatorAccount) {
        if (typeof fileName != "string") return null;
        if (typeof creatorAccount != "string") return null;
        return new Article(fileName, creatorAccount);
    }

    GetCategory(categoryName) {
        if (typeof categoryName != "string") return null;
        if (this.m_mapCategory.has(categoryName)) {
            return this.m_mapCategory.get(categoryName);
        } else {
            return null;
        }
    }
    GetHistoryArray() { return this.m_arrayHistory; }
};

let h = new ArticleHandler();
module.exports.HasConfig = function(fileName){ return h.HasConfig(fileName); }
module.exports.GetConfig = function(fileName){return h.GetConfig(fileName);}
module.exports.CreateArticleProxy = function (fileName, creatorAccount) { return h.CreateArticleProxy(fileName, creatorAccount); }
module.exports.GetCategory = function (categoryName) { return h.GetCategory(categoryName); }
module.exports.GetHistoryArray = function () { return h.GetHistoryArray(); }
module.exports.Search = function (searchValue, out) { return h.Search(searchValue, out); }
module.exports.Modify = function (ac, content) { return h.Modify(ac, content); }
module.exports.Delete = function (ac) { return h.Delete(ac); }
module.exports.Add = function (fileName) { return h.Add(fileName); }