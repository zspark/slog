const {HistoryActionType, Group, Result, PresentMode, GlobalPaths} = require("../core/basic");
const IOSystem = require("../core/io_system");
const UserManager = require("../core/user_manager");
const Utils = require("../core/utils");
const Log = require("../core/logger");

let articles = new Group("articles");
let notebooks = new Group("notebooks");
let tags = new Group("tags");
let arrHistory = [];

class History {
    constructor() {
        this.fileName = "";
        this.title = "";
        this.action = HistoryActionType.UNKNOWN;
        this.time = null;
    }

    ToObject() {
        return JSON.parse(JSON.stringify(this));
    }
}

/**
 * we save using toISOString,
 * we display using toDateString,
 */
class AccountAndTime {
    constructor(acc, time) {
        Utils.CreateProperty(this, "accountID", acc, false, true, true);
        Utils.CreateProperty(this, "time", new Date(time), false, true, true);
        let _tmp = {};
        if (UserManager.GetAccountDisplayName(acc, _tmp) == Result.ACCOUNT_NOT_EXIST) {
            Utils.CreateProperty(this, "accountDisplayName", "anonymous", false, true, true);
        } else {
            Utils.CreateProperty(this, "accountDisplayName", _tmp.data, false, true, true);
        }
    }

    get displayTimeString() {
        return this.time.toDateString();
    }

    get saveTimeString() {
        return this.time.toISOString();
    }
}

class Tag extends Group {
    constructor(id) {
        super(id);
        this.published = true;
        this.displayName = "";
    }
}

class Article extends Group {
    constructor(id, accID, time) {
        super(id);
        this.createInfo = new AccountAndTime(accID, time);
        this.modifyInfo = null;
        this.displayName = '';
        this.description = '';
        this.presentMode = PresentMode.DEFAULT;
        this.sortPriority = 0;  // used while sorting, for such 'always on top' business. biggest on most top.
        this.allowHistory = true;
        this.allowSearch = true;
        this.published = false;
        this.notebook = null;
    }

    get fileURL() {
        return GlobalPaths.ROOT_CONTENT + "article/article/" + this.id;
    }

    get fileName() {
        return this.id;
    }

    SetNotebook(n) {
        if (this.notebook) {
            this.notebook.RemoveItem(this.id);
        }
        this.notebook = n;
        n.AddItem(this.id, this);
    }

    AddTag(t) {
        this.AddItem(t.id, t);
        t.AddItem(this.id, this);
    }

    ClearTags() {
        this.mapItem.forEach((_t) => {
            _t.RemoveItem(this.id);
        });
        this.mapItem.clear();
    }

    SaveContent(c, out) {
        let _b = IOSystem.WriteFileUTF8(fileURL, c);
        if (_b) {
            return Result.OK;
        } else {
            out.msg = `article saving failure! file name:${fileURL}`;
            return Result.FAIL;
        }
    }

    ReadContent(out) {
        if (IOSystem.FileExist(this.fileURL)) {
            out.data = IOSystem.ReadFileUTF8(this.fileURL);
            return Result.OK;
        } else {
            out.msg = `There is NO such file(${this.fileURL}) exist.`;
            return Result.FILE_NOT_EXIST;
        }
    }

    ToObject() {
        return JSON.parse(JSON.stringify(this));
    }

    UpdateTags(arrTagNames) {
        let _arr = this.arrTag;
        for (let i = 0, N = _arr.length; i < N; ++i) {
            let _tagName = _arr[i];
            if (arrTagNames.indexOf(_tagName) < 0) {
                Utils.EraseValueFromArray(_arr, _tagName);
            }
        }

        for (let i = 0, N = arrTagNames.length; i < N; ++i) {
            let _tagName = arrTagNames[i];
            if (_arr.indexOf(_tagName) < 0) {
                _arr.push()
            }
        }
    }
}

class Notebook extends Group {
    constructor(id, accID, time) {
        super(id);
        Log.Info('[CONSTRUCTOR] Notebook ...');
        this.createInfo = new AccountAndTime(accID, time);
        this.displayName = "default";
    }
}


let Search = function (searchValue, out) {
    if (typeof searchValue != "string") {
        out.msg = `param should be in string type.`;
        Result.INVALID_ARGUMENT;
    }
    if (searchValue.length <= 0) {
        out.msg = `param should be a NONE empty string.`;
        Result.INVALID_ARGUMENT;
    }
    searchValue = searchValue.toLowerCase();

    out.data = [];
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

    articles.ForEachItem((k, _obj, m) => {
        let _range = [];

        if (_test(_obj.fileName, _range)) {
            out.data.push({
                fileName: _obj.fileName,
                title: _obj.displayName,
                range: _range,
                from: "name",
                author: _obj.createInfo.accountDisplayName,
            });
            return;
        }

        if (_test(_obj.displayName, _range)) {
            out.data.push({
                fileName: _obj.fileName,
                title: _obj.displayName,
                range: _range,
                from: "title",
                author: _obj.createInfo.accountDisplayName,
            });
        }
    });
    return Result.OK;
}

let UpdateHistory = function (fileName, action) {
    /// check last history
    if (arrHistory.length > 0) {
        let _topElem = arrHistory[0];
        if (fileName == _topElem.fileName) {
            if (action == _topElem.GetAction()) {
                _topElem.time = new Date();
                return Result.OK;
            }
        }
    }

    let _p = articles.GetItem(fileName);
    let _h = null;
    if (arrHistory.length > 49) {
        _h = arrHistory.pop();
    } else {
        _h = new History();
    }
    _h.fileName = _p.fileName;
    _h.title = _p.displayName;
    _h.action = action;
    _h.time = new Date();
    arrHistory.unshift(_h);
    return Result.OK;
}

let CreateArticle = function (id, cid, ctime) {
    let _a = new Article(id, cid, ctime);
    articles.AddItem(id, _a);
    return _a;
}

let CreateTag = function (id) {
    let _t = new Tag(id);
    tags.AddItem(id, _t);
    return _t;
}

let CreateNotebook = function (id, cid, ctime) {
    let _n = new Notebook(id, cid, ctime);
    notebooks.AddItem(id, _n);
    return _n;
}

const templateSummaryJson = {
    "version": "2.0.0",
    "tags": [],
    "articles": [],
    "notebooks": []
};

const templateHistoryJson = {
    "version": "1.0.0",
    "contents": []
};

let Init = function () {
    let _config = null;
    const _summaryFileURL = GlobalPaths.ROOT_CONTENT + "article/.summary.json";
    if (!IOSystem.FileExist(_summaryFileURL)) {
        _config = JSON.parse(JSON.stringify(templateSummaryJson));
    } else {
        _config = JSON.parse(IOSystem.ReadFileUTF8(_summaryFileURL));
    }

    const _arrNotebook = _config.notebooks;
    for (let i = 0, N = _arrNotebook.length; i < N; ++i) {
        const _tmp = _arrNotebook[i];
        let _n = CreateNotebook(_tmp.id, _tmp.creatorID, _tmp.createTime);
        _n.displayName = _tmp.displayName;
    }

    const _arrTag = _config.tags;
    for (let i = 0, N = _arrTag.length; i < N; ++i) {
        const _tmp = _arrTag[i];
        let _t = CreateTag(_tmp.id);
        _t.published = _tmp.published;
        _t.displayName = _tmp.displayName;
    }

    const _arrArticle = _config.articles;
    for (let i = 0, N = _arrArticle.length; i < N; ++i) {
        const _tmp = _arrArticle[i];
        let _a = CreateArticle(_tmp.id, _tmp.creatorID, _tmp.createTime);
        _a.modifyInfo = new AccountAndTime(_tmp.modifierAccount, _tmp.modifyTime);
        _a.displayName = _tmp.displayName;
        _a.description = _tmp.description;
        _a.presentMode = _tmp.presentMode;
        _a.sortPriority = _tmp.sortPriority;
        _a.allowHistory = _tmp.allowHistory;
        _a.allowSearch = _tmp.allowSearch;
        _a.published = _tmp.published;

        let _n = notebooks.GetItem(_tmp.notebook);
        if (!_n) {
            _n = CreateNotebook(_tmp.notebook, _tmp.creatorID, new Date().toISOString());
            _n.displayName = _tmp.displayName;
        }
        _a.SetNotebook(_n);

        for (let j = 0, M = _tmp.tags.length; j < M; ++j) {
            const _tid = _tmp.tags[j];
            let _t = tags.GetItem(_tid);
            if (!_t) {
                _t = CreateTag(_tid);
                _t.published = false;
                _t.displayName = _tid;
            }
            _a.AddTag(_t);
        }
    }

    /// history
    const _historyFileURL = GlobalPaths.ROOT_CONTENT + "article/.history.json";
    if (!IOSystem.FileExist(_historyFileURL)) {
        _config = JSON.parse(JSON.stringify(templateHistoryJson));
    } else {
        _config = JSON.parse(IOSystem.ReadFileUTF8(_historyFileURL));
    }

    const _arr = _config.contents;
    for (let i = 0, N = _arr.length; i < N; ++i) {
        let _h = new History();
        _h.fileName = _arr[i].fileName;
        _h.title = _arr[i].title;
        _h.action = _arr[i].action;
        _h.time = new Date(_arr[i].time);
        arrHistory.push(_h);
    }
}()

module.exports.Search = function (target, out) {
    return Search(target, out);
}
module.exports.UpdateHistory = function (id, action) {
    return UpdateHistory(id, action);
}
module.exports.GetHistory = function (out) {
    Utils.CreateProperty(out, "data", arrHistory, false, false, true);
    return Result.OK;
}
module.exports.GetArticle = function (id) {
    return articles.GetItem(id);
}
module.exports.CreateArticle = function (id, accID, time) {
    let _tmp = new Article(id, accID, time);
    articles.AddItem(id, _tmp);
    return _tmp;
}
module.exports.GetTag = function (id) {
    return tags.GetItem(id);
}
module.exports.GetNotebook = function (id) {
    return notebooks.GetItem(id);
}
