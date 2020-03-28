const common = require("../common");
const pathes = common.pathes;
const constant = common.constant;
var Base = require(pathes.pathMW + "middleware_module_base");
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const DV = require(pathes.pathCore + 'disk_visitor');
const CC = require(pathes.pathCore + "content_controller");
const UserManager = require(pathes.pathCore + "user_manager");

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

  Save(title, author, category, template, content) {
    const _fileName = this.editingFileName;
    if (CC.GetConfig(_fileName)) {
      CC.Modify(_fileName, category, title, author, template, content);
    } else {
      CC.Add(_fileName, category, title, author, template, content);
    }
  }
}

var _CreateDefaultPostBackInstance = function () {
  let _obj = Object.create(null);
  _obj.resTime = new Date();
  _obj.code = constant.action_code.ACTION_CONFIRMED;
  _obj.redirectURL = null;
  _obj.msg = "";
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
      _ForceStopHeartBeatCheck();
    }
  }, 20000);
  return true;
}

var _ForceStopHeartBeatCheck = function () {
  if (s_connectionCheck != null) {
    clearInterval(s_connectionCheck);
    s_connectionCheck = null;
  }
}

class ModuleEdit extends Base {
  constructor() {
    super();
    this.editorHtmlURL = pathes.pathTemplate + "template_editor.ejs";
    this.noPermissionHtmlURL = pathes.pathTemplate + "template_no_permission.ejs";
    this.previewHtmlURL = pathes.pathTemplate + "template_preview.ejs";
    this.m_mapEditSession = new Map();
  };

  GetPreviewHtmlHandler(req, res) {
    this.RenderEjs(req, res, this.previewHtmlURL, {});
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

    let _obj = Object.create(null);
    _obj[constant.M_FILE_NAME] = _fileName;
    _obj[constant.M_AUTHOR] = UserManager.GetUserInfo(Utils.GetUserAccount(req)).displayName;
    _obj[constant.M_CATEGORY] = constant.M_CATEGORY_DEFAULT;
    _obj[constant.M_TITLE] = "";
    _obj[constant.M_TEMPLATE] = "template_view.ejs";
    _obj[constant.M_CONTENT] = "";

    var _cfg = CC.GetConfig(_fileName);
    if (_cfg) {
      _obj[constant.M_AUTHOR] = _cfg[constant.M_AUTHOR];
      _obj[constant.M_CATEGORY] = _cfg[constant.M_CATEGORY];
      _obj[constant.M_TITLE] = _cfg[constant.M_TITLE];
      _obj[constant.M_TEMPLATE] = _cfg[constant.M_TEMPLATE];
    }

    const _fileURL = pathes.pathArticle + _fileName;
    let _content = DV.ReadFileUTF8(_fileURL);
    if (_content != null) {
      _obj[constant.M_CONTENT] = _content;
    }

    this.RenderEjs(req, res, this.editorHtmlURL, { obj: _obj });
    return true;
  };

  HandlePostArticle(req, res) {
    let _obj = _CreateDefaultPostBackInstance();

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
      const _title = _jsonObj[constant.M_TITLE];
      const _author = _jsonObj[constant.M_AUTHOR];
      const _category = _jsonObj[constant.M_CATEGORY];
      const _template = _jsonObj[constant.M_TEMPLATE];
      const _content = _jsonObj[constant.M_CONTENT];
      _es.Save(_title, _author, _category, _template, _content);
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

  LoginFirst(req, res){
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
