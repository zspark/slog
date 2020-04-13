const common = require("./common");
const pathes = common.pathes;
const constant = common.constant;
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const DV = require(pathes.pathCore + 'disk_visitor');

let _ModifyConfig = function (cfg, fileName, category, title, author, template, allowHistory) {
  if (fileName != null) cfg.fileName = fileName;
  if (category != null) cfg.category = category;
  if (title != null) cfg.title = title;
  if (author != null) cfg.author = author;
  if (template != null) cfg.template = template;
  if (allowHistory != null) cfg.allowHistory = allowHistory;
}

var default_summary_json = {
  "version": "1.0.0",
  "articles": {}
}

var default_history_json = {
  "version": "1.0.0",
  "history": [],
}

class Organizer {
  constructor() {
    LOG.Info("[CONSTRUCT] article organizer...");

    if (DV.FileExist(pathes.urlArticleConfig)) {
      let configJson = DV.ReadFileUTF8(pathes.urlArticleConfig);
      LOG.Info("parse article config...");
      this.config = JSON.parse(configJson);
    } else {
      this.config = default_summary_json;
    }
    this.configArticles = this.config[constant.M_ARTICLE];

    if (DV.FileExist(pathes.urlHistoryConfig)) {
      let configJson = DV.ReadFileUTF8(pathes.urlHistoryConfig);
      LOG.Info("parse history config...");
      this.configHistory = JSON.parse(configJson);
    } else {
      this.configHistory = default_history_json;
    }

    this.configCategories = Object.create(null);
    for (let fileName in this.configArticles) {
      let category = this.configArticles[fileName][constant.M_CATEGORY];
      this._AppendToCategory(category, fileName);
    }
  };

  _CreateArticleConfig() {
    let _obj = {
      fileName: "",
      title: "<no title>",
      createTime: new Date().toISOString(),
      author: "anonymous",
      category: "default",
      template: constant.M_TEMPLATE_DEFAULT,
      allowHistory: true,
    };
    return _obj;
  }

  _RemoveFromCategory(category, fileName) {
    let _arr = this.configCategories[category];
    if (_arr) {
      Utils.DeleteFromArray(_arr, fileName);
      if (_arr.length <= 0) delete this.configCategories[category];
    }
  };

  _AppendToCategory(category, fileName) {
    let _arr = this.configCategories[category];
    if (!_arr) {
      _arr = [];
      this.configCategories[category] = _arr;
    }
    _arr.push(fileName);
  }

  _AppendToHistory(fileName, title, action) {
    let _arr = this.configHistory[constant.M_HISTORY];
    if (_arr.length > 0) {
      let _topElem = _arr[0];
      if (fileName == _topElem[constant.M_FILE_NAME]) {
        if (action == _topElem[constant.M_ACTION]) {
          _topElem[constant.M_TIME] = new Date().toISOString();
          return false;
        }
      }
    }

    let _elem = Object.create(null);
    _elem[constant.M_FILE_NAME] = fileName;
    _elem[constant.M_TITLE] = title;
    _elem[constant.M_ACTION] = action;
    _elem[constant.M_TIME] = new Date().toISOString();
    _arr.unshift(_elem);
    if (_arr.length > 50) {
      _arr.pop();
    }
    return true;
  }

  _SaveHistoryToDisk() {
    let configStr = JSON.stringify(this.configHistory);
    var b = DV.WriteFileUTF8(pathes.urlHistoryConfig, configStr);
    if (b) {
      LOG.Info("save history config to disk successfully.");
    } else {
      LOG.Error("save history config to disk failed!");
    }
  }

  _DeleteArticleFromDisk(fileName) {
    let b = DV.DeleteFile(pathes.pathArticle + fileName);
    if (b) {
      LOG.Info("article deleted, file name:%s", fileName);
    } else {
      LOG.Error("article deleting failed! file name:%s", fileName);
    }
  }

  _SaveArticleToDisk(fileName, content, cb) {
    var b = DV.WriteFileUTF8(pathes.pathArticle + fileName, content);
    if (b) {
      LOG.Info("article saved successfully. file name:%s", fileName);
    } else {
      LOG.Error("article saving failure! file name:%s", fileName);
    }
    if (cb) cb(b);
  }

  SaveConfigToDisk() {
    let configStr = JSON.stringify(this.config);
    var b = DV.WriteFileUTF8(pathes.urlArticleConfig, configStr);
    if (b) {
      LOG.Info("save article config content to disk successfully.");
    } else {
      LOG.Error("save article config content to disk failed!");
    }
  };

  Add(fileName, category, title, author, template, allowHistory, content, save = true) {
    if (this.GetConfig(fileName)) return false;

    let _cfg = this._CreateArticleConfig();
    _ModifyConfig(_cfg, fileName, category, title, author, template, allowHistory);
    this.configArticles[fileName] = _cfg;
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
    let config = this.GetConfig(fileName);
    if (config) {
      const _title = config[constant.M_TITLE];
      const _category = config[constant.M_CATEGORY];
      this._RemoveFromCategory(_category, fileName);
      delete this.configArticles[fileName];
      this.SaveConfigToDisk();
      this._DeleteArticleFromDisk(fileName);
      if (this._AppendToHistory(fileName, _title, constant.M_ACTION_DELETE)) this._SaveHistoryToDisk();
      LOG.Info("article deleted. file name:%s", fileName);
      return true;
    } else {
      LOG.Error("there is no config exist! file name:%s", fileName);
      return false;
    }
  };

  Modify(fileName, category, title, author, template, allowHistory, content) {
    let _cfg = this.GetConfig(fileName);
    if (_cfg) {
      let lastCategory = _cfg[constant.M_CATEGORY];
      if (lastCategory != category) {
        this._RemoveFromCategory(lastCategory, fileName);
        this._AppendToCategory(category, fileName);
      }
      _ModifyConfig(_cfg, fileName, category, title, author, template, allowHistory);
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

    let _test = function (str) {
      str = str.toLowerCase();
      let i = 0;
      let fromIdx = 0;
      do {
        let offset = str.indexOf(_arr[i], fromIdx);
        if (offset < 0){
          return false;
        }
        fromIdx = offset + _arr[i].length + 1; /// +1 : pass one space char.
        ++i;
      } while (i < N)
      return true;
    }

    for (var _fileName in this.configArticles) {
      let _obj = this.configArticles[_fileName];

      if (_test(_obj.fileName)) {
        out.push({ fileName: _obj.fileName, from: "name", content: _obj.fileName });
        continue;
      }

      if (_test(_obj.title)) {
        out.push({ fileName: _obj.fileName, from: "title", content: _obj.title });
      }
    }
    return true;
  }

  /**
   * @param {String} fileName
   * @param {Object}
   */
  GetConfig(fileName) {
    return this.configArticles[fileName];
  }

  /**
   * @param {String} category 
   * @return {Array}
   */
  GetCategory(category) {
    return this.configCategories[category];
  }

  GetCategories() {
    let _c = JSON.parse(JSON.stringify(this.configCategories));
    return _c;
  }

  GetArticleCount() {
    let _n = 0;
    for (let fileName in this.configArticles) {
      ++_n;
    }
    return _n;
  }

  GetHistoryArray() {
    let _arr = this.configHistory[constant.M_HISTORY];
    return _arr;
  }

};

let org = new Organizer();
module.exports = org;
