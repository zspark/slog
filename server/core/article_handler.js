const common = require("./common");
const pathes = common.pathes;
const constant = common.constant;
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const IOSystem = require(pathes.pathCore + 'io_system');

const default_summary_json = {
    "version": "1.0.0",
    "articles": [],
}

const default_history_json = {
    "version": "1.0.0",
    "history": [],
}

class HistoryConfig {
    #fileName;
    #title;
    #action;
    #time;

    constructor(obj) {
        this.#fileName = obj ? obj.fileName : "<no-file-name>";
        this.#title = obj ? obj.title : "<no-title>";
        this.#action = obj ? obj.action : "";
        this.#time = obj ? obj.time : new Date().toISOString();
    }

    ToObject() {
        let _obj = {
            fileName: this.#fileName,
            title: this.#title,
            action: this.#action,
            time: this.#time,
        };
        return _obj;
    }

    GetFileName() { return this.#fileName; }
    SetFileName(fileName) { this.#fileName = fileName; }
    GetTitle() { return this.#title; }
    SetTitle(title) { this.#title = title; }
    GetAction() { return this.#action; }
    SetAction(action) { this.#action = action; }
    GetTime() { return this.#time; }
    GetTimeString() { return new Date(this.#time).toISOString(); }
    SetTime(time) { this.#time = time; }
};

class ArticleConfig {

    #fileName;
    #title;
    #createTime;
    #modifyTime;
    #author;
    #category;
    #layout;
    #allowHistory;
    #secret;

    constructor(obj, fileName) {
        this.#fileName = obj ? obj[constant.M_FILE_NAME] : fileName;
        this.#title = obj ? obj[constant.M_TITLE] : "<no-title>";
        this.#createTime = obj ? obj[constant.M_CREATE_TIME] : new Date().toISOString();
        this.#modifyTime = obj ? obj[constant.M_MODIFY_TIME] : new Date().toISOString();
        this.#author = obj ? obj[constant.M_AUTHOR] : "anonymous";
        this.#category = obj ? obj[constant.M_CATEGORY] : "default";
        this.#layout = obj ? obj[constant.M_LAYOUT] : constant.M_TEMPLATE_DEFAULT;
        this.#allowHistory = obj ? obj[constant.M_ALLOW_HISTORY] : true;
        this.#secret = obj ? obj[constant.M_SECRET] : false;
    }

    ToObject() {
        let _obj = {
            fileName: this.#fileName,
            title: this.#title,
            createTime: this.#createTime,
            modifyTime: this.#modifyTime,
            author: this.#author,
            category: this.#category,
            layout: this.#layout,
            allowHistory: this.#allowHistory,
            secret: this.#secret,
        };
        return _obj;
    }


    /*
    Modify(fileName, category, title, author, layout, allowHistory) {
        if (fileName != null) this.#fileName = fileName;
        if (category != null) this.#category = category;
        if (title != null) this.#title = title;
        if (author != null) this.#author = author;
        if (layout != null) this.#layout = layout;
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
    SetLayout(layout) { this.#layout = layout; }
    GetLayout() { return this.#layout; }
    SetAllowHistory(b) { this.#allowHistory = b; }
    GetAllowHistory() { return this.#allowHistory; }
    SetSecret(b) { this.#secret = b; }
    GetSecret() { return this.#secret; }
    GetCreateTime() { return this.#createTime; }
    GetCreateTimeString() { return new Date(this.#createTime).toDateString(); }
    GetModifyTime() { return this.#modifyTime; }
    GetModifyTimeString() { return new Date(this.#modifyTime).toDateString(); }

};

class ArticleHandler {
    #m_MapFileNameToArticleConfig;
    #m_MapCategoryToFileName;
    #m_ArrayHistoryConfig;
    constructor() {
        LOG.Info("[CONSTRUCT] article organizer...");
        this.#m_MapFileNameToArticleConfig = new Map();
        this.#m_MapCategoryToFileName = new Map();
        this.#m_ArrayHistoryConfig = [];

        if (IOSystem.FileExist(pathes.urlArticleConfig)) {
            LOG.Info("read and parse article config...");
            const _data = IOSystem.ReadFileUTF8(pathes.urlArticleConfig);
            let _configJson = JSON.parse(_data);
            let _arr = _configJson[constant.M_ARTICLES];

            const N = _arr.length;
            for (let i = 0; i < N; ++i) {
                let _ac = new ArticleConfig(_arr[i], "<no-file-name>");
                this.#m_MapFileNameToArticleConfig.set(_ac.GetFileName(), _ac);
                this._AppendToCategory(_ac.GetCategory(), _ac.GetFileName());
            }
        }

        if (IOSystem.FileExist(pathes.urlHistoryConfig)) {
            LOG.Info("read and parse history config...");
            const _data = IOSystem.ReadFileUTF8(pathes.urlHistoryConfig);
            let _configJson = JSON.parse(_data);
            let _arr = _configJson[constant.M_HISTORY];
            
            const N = _arr.length;
            for (let i = 0; i < N; ++i) {
                let _hc = new HistoryConfig(_arr[i]);
                this.#m_ArrayHistoryConfig.push(_hc);
            }
        }
    };

    _RemoveFromCategory(category, fileName) {
        let _arr = this.#m_MapCategoryToFileName.get(category);
        if (_arr) {
            Utils.DeleteFromArray(_arr, fileName);
            if (_arr.length <= 0) this.#m_MapCategoryToFileName.delete(category);
        }
    };

    _AppendToCategory(category, fileName) {
        let _arr = this.#m_MapCategoryToFileName.get(category);
        if (!_arr) {
            _arr = [];
            this.#m_MapCategoryToFileName.set(category, _arr);
        }
        _arr.push(fileName);
    }

    _AppendToHistory(fileName, title, action) {
        if (this.#m_ArrayHistoryConfig.length > 0) {
            let _topElem = this.#m_ArrayHistoryConfig[0];
            if (fileName == _topElem.GetFileName()) {
                if (action == _topElem.GetAction()){
                    _topElem.SetTime(new Date().toISOString());
                    return false;
                }
            }
        }

        let _elem = new HistoryConfig(null);
        _elem.SetFileName(fileName);
        _elem.SetTitle(title);
        _elem.SetAction(action);
        this.#m_ArrayHistoryConfig.unshift(_elem);
        if (this.#m_ArrayHistoryConfig.length > 50) {
            this.#m_ArrayHistoryConfig.pop();
        }
        return true;
    }

    _SaveHistoryToDisk() {
        let _config = JSON.parse(JSON.stringify(default_history_json));// copy
        let _configArticles = _config[constant.M_HISTORY];
        this.#m_ArrayHistoryConfig.forEach((hc, i, arr) => {
            _configArticles.push(hc.ToObject());
        });

        let configStr = JSON.stringify(_config);
        var b = IOSystem.WriteFileUTF8(pathes.urlHistoryConfig, configStr);
        if (b) {
            LOG.Info("save history config to disk successfully.");
        } else {
            LOG.Error("save history config to disk failed!");
        }
    }

    _DeleteArticleFromDisk(fileName) {
        let b = IOSystem.DeleteFile(pathes.pathArticle + fileName);
        if (b) {
            LOG.Info("article deleted, file name:%s", fileName);
        } else {
            LOG.Error("article deleting failed! file name:%s", fileName);
        }
    }

    _SaveArticleToDisk(fileName, content, cb) {
        var b = IOSystem.WriteFileUTF8(pathes.pathArticle + fileName, content);
        if (b) {
            LOG.Info("article saved successfully. file name:%s", fileName);
        } else {
            LOG.Error("article saving failure! file name:%s", fileName);
        }
        if (cb) cb(b);
    }

    SaveConfigToDisk() {
        let _config = JSON.parse(JSON.stringify(default_summary_json));// copy
        let _configArticles = _config[constant.M_ARTICLES];
        this.#m_MapFileNameToArticleConfig.forEach((ac, k, m) => {
            _configArticles.push(ac.ToObject());
        });

        let configStr = JSON.stringify(_config);
        var b = IOSystem.WriteFileUTF8(pathes.urlArticleConfig, configStr);
        if (b) {
            LOG.Info("save article config content to disk successfully.");
        } else {
            LOG.Error("save article config content to disk failed!");
        }
    };

    Add(fileName, category, title, author, layout, allowHistory, content, save = true) {
        if (this.GetConfig(fileName)) return false;

        let _cfg = new ArticleConfig(null, fileName);
        _cfg.SetCategory(category);
        _cfg.SetTitle(title);
        _cfg.SetAuthor(author);
        _cfg.SetLayout(layout);
        _cfg.SetAllowHistory(allowHistory);

        this.#m_MapFileNameToArticleConfig.set(fileName) = _cfg;
        this._AppendToCategory(category, fileName);

        if (save) {
            this.SaveConfigToDisk();
            this._SaveArticleToDisk(fileName, content);
            if (allowHistory) {
                if (this._AppendToHistory(fileName, title, constant.M_ACTION_NEW)) this._SaveHistoryToDisk();
            }
        }
        return true;
    };

    Delete(fileName) {
        let _ac = this.GetConfig(fileName);
        if (_ac) {
            this._RemoveFromCategory(_ac.GetCategory(), fileName);
            this.#m_MapFileNameToArticleConfig.delete(fileName);
            this.SaveConfigToDisk();
            this._DeleteArticleFromDisk(fileName);
            if (this._AppendToHistory(fileName, _ac.GetTitle(), constant.M_ACTION_DELETE)) this._SaveHistoryToDisk();
            return true;
        } else {
            LOG.Error("there is no config exist! file name:%s", fileName);
            return false;
        }
    };

    Modify(fileName, category, title, author, layout, allowHistory, content) {
        let _cfg = this.GetConfig(fileName);
        if (_cfg) {
            let lastCategory = _cfg.GetCategory();
            if (lastCategory != category) {
                this._RemoveFromCategory(lastCategory, fileName);
                this._AppendToCategory(category, fileName);
            }

            _cfg.SetCategory(category);
            _cfg.SetTitle(title);
            _cfg.SetAuthor(author);
            _cfg.SetLayout(layout);
            _cfg.SetAllowHistory(allowHistory);


            this.SaveConfigToDisk();
            this._SaveArticleToDisk(fileName, content);
            if (allowHistory) {
                if (this._AppendToHistory(fileName, title, constant.M_ACTION_MODIFIED)) this._SaveHistoryToDisk();
            }
            LOG.Info("article modified. file name:%s", fileName);
            return true;
        } else {
            LOG.Error("there is no config exist! file name:%s", fileName);
            return false;
        }
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

        this.#m_MapFileNameToArticleConfig.forEach((_obj, k, m) => {
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

    GetConfig(fileName) { return this.#m_MapFileNameToArticleConfig.get(fileName); }
    GetCategory(category) { 
        if (typeof category != "string") return null;
        return this.#m_MapCategoryToFileName.get(category);
     }
    GetHistoryArray() { return this.#m_ArrayHistoryConfig; }

    /*
    GetArticleCount() {
        let _n = 0;
        for (let fileName in this.#m_MapFileNameToArticleConfig) {
            ++_n;
        }
        return _n;
    }
    */
};

let h = new ArticleHandler();
module.exports = h;
