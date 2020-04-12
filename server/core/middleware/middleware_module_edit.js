const common = require("../common");
const pathes = common.pathes;
const constant = common.constant;
var Base = require(pathes.pathMW + "middleware_module_base");
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const DV = require(pathes.pathCore + 'disk_visitor');
const CC = require(pathes.pathCore + "content_controller");
const UserManager = require(pathes.pathCore + "user_manager");
const TPLGEN = require(pathes.pathCore + "template_generator");

class EditSession {
  constructor() {
    this.editingAccount = "";
    this.editingIP = "0.0.0.0";
    this.editingStartTime = null;
    this.editingLastHeartBeatTime = null;
    this.editingFileName = "";
  };

  Init(acc, ip, fileName) {
    this.editingAccount = acc;
    this.editingIP = ip;
    this.editingFileName = fileName;
    this.editingStartTime = new Date();
    this.editingLastHeartBeatTime = new Date().getTime();
  }

  TryRefresh(acc, ip) {
    if (acc != this.editingAccount) return false;
    if (ip != this.editingIP) return false;
    this.editingLastHeartBeatTime = new Date().getTime();
    return true;
  }

  Delete() {
    CC.Delete(this.editingFileName);
  }

  Save(title, author, category, template, allowHistory, content) {
    const _fileName = this.editingFileName;
    if (CC.GetConfig(_fileName)) {
      CC.Modify(_fileName, category, title, author, template, allowHistory, content);
    } else {
      CC.Add(_fileName, category, title, author, template, allowHistory, content);
    }
  }
}

var _CreateDefaultResponseObject = function () {
  let _obj = {
    resTime: new Date(),
    code: constant.action_code.ACTION_CONFIRMED,
    redirectURL: null,
    msg: "",
  }
  return _obj;
}

var s_connectionCheck = null;
var _StartHearBeatCheck = function (m) {
  if (s_connectionCheck != null) return false;

  s_connectionCheck = setInterval(() => {
    let _map = m;

    _map.forEach((value, key, m) => {
      let _delta = new Date().getTime() - value.editingLastHeartBeatTime;
      LOG.Info("delta:%d", _delta);
      if (_delta > 20000) {
        LOG.Info("delete session");
        _map.delete(key);
      }
    });

    if (_map.size <= 0) {
      if (s_connectionCheck != null) {
        clearInterval(s_connectionCheck);
        s_connectionCheck = null;
      }
    }
  }, 20000);
  return true;
}

class ModuleEdit extends Base {
  constructor() {
    super();
    this.m_mapEditSession = new Map();
  };

  GetPreviewHtmlHandler(req, res) {
    let _html = TPLGEN.GenerateHTMLPreview();
    res.end(_html);
  }

  GetHandler(req, res) {
    LOG.Info("edit get handler.");
    const _fileName = req.query.n;

    let _es = this.m_mapEditSession.get(_fileName);
    if (_es) {
      this.ComposeInfoboard(req, res, `This file is currently editing by someone!`);
      return true;
    }

    _es = new EditSession();
    _es.Init(Utils.GetUserAccount(req), Utils.GetClientIP(req), _fileName);
    this.m_mapEditSession.set(_fileName, _es);

    _StartHearBeatCheck(this.m_mapEditSession);

    let _GetTemplateList = function (firstEle) {
      let _list = [];
      _list.push(firstEle);
      constant.M_TEMPLATE_LIST.forEach(template => {
        if (template != firstEle) {
          _list.push(template);
        }
      });
      return _list;
    }

    const _fileURL = pathes.pathArticle + _fileName;
    let _content = DV.ReadFileUTF8(_fileURL);
    if (_content == null) {
      _content = "";
    }

    const _cfg = CC.GetConfig(_fileName);
    if (_cfg) {
      let _html = TPLGEN.GenerateHTMLEdit(
        _content,
        _cfg.title,
        _cfg.author,
        _cfg.category,
        _cfg.allowHistory == null ? true : _cfg.allowHistory,
        _GetTemplateList(_cfg.template)
      );
      res.end(_html);
    } else {
      let _html = TPLGEN.GenerateHTMLEdit(
        _content,
        "",
        UserManager.GetUserInfo(Utils.GetUserAccount(req)).displayName,
        constant.M_CATEGORY_DEFAULT,
        true,
        _GetTemplateList(constant.M_TEMPLATE_DEFAULT)
      );
      res.end(_html);
    }

    return true;
  };

  HandlePostArticle(req, res) {
    let _obj = _CreateDefaultResponseObject();

    const _fileName = req.query.n;
    if (!_fileName) {
      _obj.code = constant.error_code.NO_FILE_NAME;
      _obj.msg = "error, no file name!";
      res.send(JSON.stringify(_obj));
      return true;
    }

    let _es = this.m_mapEditSession.get(_fileName);
    if (!_es) {
      _obj.code = constant.error_code.SERVER_SHUT_DOWN;
      res.send(JSON.stringify(_obj));
      return true;
    }

    let _jsonObj = req.body;
    if (!_jsonObj) {
      _obj.code = constant.error_code.REQUESTING_FORMAT_ERROR;
      res.send(JSON.stringify(_obj));
      return true;
    }

    let _Save = function () {
      _es.Save(_jsonObj.title, _jsonObj.author, _jsonObj.category, _jsonObj.template, _jsonObj.allowHistory, _jsonObj.content);
    }

    const action_code = constant.action_code;
    const error_code = constant.error_code;
    switch (_jsonObj[constant.M_ACTION]) {
      case action_code.HEART_BEAT:
        if (_es.TryRefresh(Utils.GetUserAccount(req), Utils.GetClientIP(req))) {
          LOG.Info("heart beat");
        } else {
          _obj.code = error_code.SERVER_SHUT_DOWN;
        }
        break;
      case action_code.DELETE:
        _es.Delete();
        this.m_mapEditSession.delete(_fileName);
        _obj.redirectURL = "/";
        break;
      case action_code.SAVE:
        _Save();
        break;
      case action_code.SAVE_AND_EXIT:
        _Save();
        _obj.redirectURL = "view?n=" + _fileName;
        this.m_mapEditSession.delete(_fileName);
        break;
      case action_code.CANCEL:
        this.m_mapEditSession.delete(_fileName);
        _obj.redirectURL = "view?n=" + _fileName;
        break;
      default:
        break;
    }

    res.send(JSON.stringify(_obj));
    return true;
  };

  LoginFirst(req, res) {
    const _fileName = req.query.n;
    if (_fileName) {
      let _url = Utils.MakeLoginWithViewURL(_fileName);
      res.redirect(_url);
    } else {
      let _url = Utils.MakeLoginURL();
      res.redirect(_url);
    }
  };

};

function Init() {
  let mw = new ModuleEdit();

  let get = function (req, res) {
    if (Utils.CheckLogin(req)) {
      const _fileName = req.query.n;
      if (_fileName) {
        mw.GetHandler(req, res);
      } else {
        let _msg = "no assigned file name!";
        LOG.Info(_msg);
        res.end(_msg);
      }
    } else {
      mw.LoginFirst(req, res);
    }
  };

  let getPreviewHtml = function (req, res) {
    if (Utils.CheckLogin(req)) {
      mw.GetPreviewHtmlHandler(req, res);
    } else {
      mw.LoginFirst(req, res);
    }
  };

  let post = function (req, res) {
    if (Utils.CheckLogin(req)) {
      mw.HandlePostArticle(req, res);
    } else {
      mw.LoginFirst(req, res);
    }
  };
  return { get: get, getPreviewHtml: getPreviewHtml, post: post };
};

module.exports.Init = Init;
