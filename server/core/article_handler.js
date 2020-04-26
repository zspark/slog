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
    constructor(obj) {
        this._fileName = obj ? obj.fileName : constant.M_DEFAULT_FILE_NAME;
        this._title = obj ? obj.title : constant.M_DEFAULT_TITLE;
        this._action = obj ? obj.action : "";
        this._time = obj ? obj.time : new Date().toISOString();
    }

    ToObject() {
        let _obj = {
            fileName: this._fileName,
            title: this._title,
            action: this._action,
            time: this._time,
        };
        return _obj;
    }

    GetFileName() { return this._fileName; }
    SetFileName(fileName) { this._fileName = fileName; }
    GetTitle() { return this._title; }
    SetTitle(title) { this._title = title; }
    GetAction() { return this._action; }
    SetAction(action) { this._action = action; }
    GetTime() { return this._time; }
    GetTimeString() { return new Date(this._time).toISOString(); }
    SetTime(time) { this._time = time; }
};

class ArticleConfig {
    constructor(obj, fileName) {
        if (obj instanceof ArticleConfig) {
            this.CopyFrom(obj);
        } else {
            this._fileName = obj ? obj[constant.M_FILE_NAME] : fileName;
            this._title = obj ? obj[constant.M_TITLE] : constant.M_DEFAULT_TITLE;
            this._createTime = obj ? obj[constant.M_CREATE_TIME] : new Date().toISOString();
            this._modifyTime = obj ? obj[constant.M_MODIFY_TIME] : new Date().toISOString();
            this._author = obj ? obj[constant.M_AUTHOR] : constant.M_DEFAULT_AUTHOR;
            this._category = obj ? obj[constant.M_CATEGORY] : constant.M_DEFAULT_CATEGORY;
            this._layout = obj ? obj[constant.M_LAYOUT] : constant.M_TEMPLATE_DEFAULT;
            this._allowHistory = obj ? obj[constant.M_ALLOW_HISTORY] : true;
            this._secret = obj ? obj[constant.M_SECRET] : false;
        }
    }

    ToObject() {
        let _obj = {
            fileName: this._fileName,
            title: this._title,
            createTime: this._createTime,
            modifyTime: this._modifyTime,
            author: this._author,
            category: this._category,
            layout: this._layout,
            allowHistory: this._allowHistory,
            secret: this._secret,
        };
        return _obj;
    }

    Clone() {
        let _ac = new ArticleConfig(this);
        return _ac;
    }

    CopyFrom(ac) {
        this._fileName = ac._fileName;
        this._title = ac._title;
        this._createTime = ac._createTime;
        this._modifyTime = ac._modifyTime;
        this._author = ac._author;
        this._category = ac._category;
        this._layout = ac._layout;
        this._allowHistory = ac._allowHistory;
        this._secret = ac._secret;
    }


    GetFileName() { return this._fileName; }
    GetTitle() { return this._title; }
    GetAuthor() { return this._author; }
    GetCategory() { return this._category; }
    GetLayout() { return this._layout; }
    GetAllowHistory() { return this._allowHistory; }
    GetSecret() { return this._secret; }
    GetCreateTime() { return this._createTime; }
    GetCreateTimeString() { return new Date(this._createTime).toDateString(); }
    GetModifyTime() { return this._modifyTime; }
    GetModifyTimeString() { return new Date(this._modifyTime).toDateString(); }

    SetTitle(t) { this._title = t; }
    SetAuthor(v) { this._author = v; }
    SetCategory(category) { this._category = category; }
    SetLayout(layout) { this._layout = layout; }
    SetAllowHistory(b) { this._allowHistory = b; }
    SetSecret(b) { this._secret = b; }
    SetModifyTime(v) { this._modifyTime = v; }

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

    _AppendToHistory(ac, action) {
        if (this.#m_ArrayHistoryConfig.length > 0) {
            let _topElem = this.#m_ArrayHistoryConfig[0];
            if (ac.GetFileName() == _topElem.GetFileName()) {
                if (action == _topElem.GetAction()) {
                    _topElem.SetTime(new Date().toISOString());
                    return false;
                }
            }
        }

        let _elem = new HistoryConfig(null);
        _elem.SetFileName(ac.GetFileName());
        _elem.SetTitle(ac.GetTitle());
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

    _SaveConfigToDisk() {
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

    Add(ac, content) {
        if (!ac) return false;
        if (!ac instanceof ArticleConfig) return false;

        const fileName = ac.GetFileName();
        if (this.HasConfig(fileName)) return false;

        let _articleConfig = ac.Clone();
        this.#m_MapFileNameToArticleConfig.set(fileName, _articleConfig);
        this._AppendToCategory(_articleConfig.GetCategory(), fileName);

        this._SaveConfigToDisk();
        this._SaveArticleToDisk(fileName, content);
        if (_articleConfig.GetAllowHistory()) {
            this._AppendToHistory(_articleConfig, constant.M_ACTION_NEW);
            this._SaveHistoryToDisk();
        }
        return true;
    };

    Delete(ac) {
        if (!ac) return false;
        if (!ac instanceof ArticleConfig) return false;

        const fileName = ac.GetFileName();
        if (!this.HasConfig(fileName)) return false;

        this._RemoveFromCategory(ac.GetCategory(), fileName);
        this.#m_MapFileNameToArticleConfig.delete(fileName);
        this._SaveConfigToDisk();
        this._DeleteArticleFromDisk(fileName);
        this._AppendToHistory(ac, constant.M_ACTION_DELETE);
        this._SaveHistoryToDisk();
        return true;
    };

    Modify(ac, content) {
        if (!ac) return false;
        if (!ac instanceof ArticleConfig) return false;

        const fileName = ac.GetFileName();
        if(!this.HasConfig(fileName))return false;

        let _targetAc = this.#m_MapFileNameToArticleConfig.get(fileName);
        const currentCategory = ac.GetCategory();
        const lastCategory = _targetAc.GetCategory();
        if (lastCategory != currentCategory) {
            this._RemoveFromCategory(lastCategory, fileName);
            this._AppendToCategory(currentCategory, fileName);
        }
        _targetAc.CopyFrom(ac);


        this._SaveConfigToDisk();
        this._SaveArticleToDisk(fileName, content);
        if (_targetAc.GetAllowHistory()) {
            this._AppendToHistory(ac, constant.M_ACTION_MODIFIED);
            this._SaveHistoryToDisk();
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

    HasConfig(fileName) {
        let _ac = this.#m_MapFileNameToArticleConfig.get(fileName);
        return _ac != null;
    }

    GetConfig(fileName) {
        let _ac = this.#m_MapFileNameToArticleConfig.get(fileName);
        if (_ac) {
            return _ac.Clone();
        } else {
            return null;
        }
    }

    CreateConfig(fileName) { return new ArticleConfig(null, fileName); }

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
