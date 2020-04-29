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

class Category {
    constructor(name) {
        this._categoryName = name;
        this._vecFileNames = [];
    }

    Add(fileName) {
        if (typeof fileName != "string") return false;
        let idx = this._vecFileNames.indexOf(fileName);
        if (idx >= 0) return false;
        this._vecFileNames.push(fileName);
        return true;
    }

    Remove(fileName) {
        if (typeof fileName != "string") return false;
        let idx = this._vecFileNames.indexOf(fileName);
        if (idx < 0) return false;
        this._vecFileNames.splice(idx, 1);
        return true;
    }

    Size() {
        return this._vecFileNames.length;
    }

    ForEachFileName(fn){
        if(fn instanceof Function){
            this._vecFileNames.forEach((e, i, v) => {
                fn(e);
            });
            return true;
        }
        return false;
    }
};

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
    SetFileName(v) { this._fileName = v; }
    GetTitle() { return this._title; }
    SetTitle(v) { this._title = v; }
    GetAction() { return this._action; }
    SetAction(v) { this._action = v; }
    GetTime() { return this._time; }
    GetTimeString() { return new Date(this._time).toISOString(); }
    SetTime(v) { this._time = v; }
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
            this._categoryName = obj ? obj[constant.M_CATEGORY] : constant.M_DEFAULT_CATEGORY_NAME;
            this._layout = obj ? obj[constant.M_LAYOUT] : constant.M_TEMPLATE_DEFAULT;
            this._allowHistory = obj ? obj[constant.M_ALLOW_HISTORY] : true;
            this._secret = obj ? obj[constant.M_SECRET] : false;
            this._parser = obj ? obj[constant.M_PARSER] : constant.M_DEFAULT_PARSER;
        }
    }

    ToObject() {
        let _obj = {
            fileName: this._fileName,
            title: this._title,
            createTime: this._createTime,
            modifyTime: this._modifyTime,
            author: this._author,
            category: this._categoryName,
            layout: this._layout,
            allowHistory: this._allowHistory,
            secret: this._secret,
            parser: this._parser,
        };
        return _obj;
    }

    Clone() {
        let _ac = new ArticleConfig(this);
        return _ac;
    }

    CopyFrom(ac) {
        if (ac instanceof ArticleConfig) {
            this._fileName = ac._fileName;
            this._title = ac._title;
            this._createTime = ac._createTime;
            this._modifyTime = ac._modifyTime;
            this._author = ac._author;
            this._categoryName = ac._categoryName;
            this._layout = ac._layout;
            this._allowHistory = ac._allowHistory;
            this._secret = ac._secret;
            this._parser = ac._parser;
        }
    }

    GetFileName() { return this._fileName; }
    GetTitle() { return this._title; }
    GetAuthor() { return this._author; }
    GetCategoryName() { return this._categoryName; }
    GetLayout() { return this._layout; }
    GetAllowHistory() { return this._allowHistory; }
    GetSecret() { return this._secret; }
    GetCreateTime() { return this._createTime; }
    GetCreateTimeString() { return new Date(this._createTime).toDateString(); }
    GetModifyTime() { return this._modifyTime; }
    GetModifyTimeString() { return new Date(this._modifyTime).toDateString(); }
    GetParser() { return this._parser; }

    SetTitle(t) { this._title = t; }
    SetAuthor(v) { this._author = v; }
    SetCategoryName(v) { this._categoryName = v; }
    SetLayout(layout) { this._layout = layout; }
    SetAllowHistory(b) { this._allowHistory = b; }
    SetSecret(b) { this._secret = b; }
    SetModifyTime(v) { this._modifyTime = v; }
    SetModifyTime(v) { this._modifyTime = v; }

};

class ArticleHandler {
    constructor() {
        LOG.Info("[CONSTRUCT] article organizer...");
        this.m_mapArticle = new Map();
        this.m_mapCategory = new Map();
        this.m_arrayHistory = [];

        if (IOSystem.FileExist(pathes.urlArticleConfig)) {
            LOG.Info("read and parse article config...");
            const _data = IOSystem.ReadFileUTF8(pathes.urlArticleConfig);
            let _configJson = JSON.parse(_data);
            let _arr = _configJson[constant.M_ARTICLES];

            const N = _arr.length;
            for (let i = 0; i < N; ++i) {
                let _ac = new ArticleConfig(_arr[i], "<no-file-name>");
                this.m_mapArticle.set(_ac.GetFileName(), _ac);
                this._AppendToCategory(_ac.GetCategoryName(), _ac.GetFileName());
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
                this.m_arrayHistory.push(_hc);
            }
        }
    };

    _RemoveFromCategory(categoryName, fileName) {
        let _category = this.m_mapCategory.get(categoryName);
        if (_category) {
            if(_category.Remove(fileName)){
                if (_category.Size() <= 0) this.m_mapCategory.delete(categoryName);
            }
        }
    };

    _AppendToCategory(categoryName, fileName) {
        let _category = this.m_mapCategory.get(categoryName);
        if (!_category) {
            _category = new Category(categoryName);
            this.m_mapCategory.set(categoryName, _category);
        }
        _category.Add(fileName);
    }

    _AppendToHistory(ac, action) {
        if (this.m_arrayHistory.length > 0) {
            let _topElem = this.m_arrayHistory[0];
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
        this.m_arrayHistory.unshift(_elem);
        if (this.m_arrayHistory.length > 50) {
            this.m_arrayHistory.pop();
        }
        return true;
    }

    _SaveHistoryToDisk() {
        let _config = JSON.parse(JSON.stringify(default_history_json));// copy
        let _configArticles = _config[constant.M_HISTORY];
        this.m_arrayHistory.forEach((hc, i, arr) => {
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
        this.m_mapArticle.forEach((ac, k, m) => {
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
        this.m_mapArticle.set(fileName, _articleConfig);
        this._AppendToCategory(_articleConfig.GetCategoryName(), fileName);

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

        this._RemoveFromCategory(ac.GetCategoryName(), fileName);
        this.m_mapArticle.delete(fileName);
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

        let _targetAc = this.m_mapArticle.get(fileName);
        const currentCategory = ac.GetCategoryName();
        const lastCategory = _targetAc.GetCategoryName();
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
        let _ac = this.m_mapArticle.get(fileName);
        return _ac != null;
    }

    GetConfig(fileName) {
        let _ac = this.m_mapArticle.get(fileName);
        if (_ac) {
            return _ac.Clone();
        } else {
            return null;
        }
    }

    CreateConfig(fileName) { return new ArticleConfig(null, fileName); }

    GetCategory(categoryName) {
        if (typeof categoryName != "string") return null;
        return this.m_mapCategory.get(categoryName);
    }
    GetHistoryArray() { return this.m_arrayHistory; }

    /*
    GetArticleCount() {
        let _n = 0;
        for (let fileName in this.m_mapArticle) {
            ++_n;
        }
        return _n;
    }
    */
};

let h = new ArticleHandler();
module.exports = h;
