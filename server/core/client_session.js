const common = require("./common");
const pathes = common.pathes;
const constant = common.constant;
const LOG = require(pathes.pathCore + 'logger');
const IOSystem = require(pathes.pathCore + 'io_system');
const Utils = require(pathes.pathCore + "utils");
const ArticleHandler = require(pathes.pathCore + "article_handler");
const UserManager = require(pathes.pathCore + "user_manager");

var s_nextID = 0;
var _GetNextID = function () {
    return s_nextID++;
};

class ClientSession {
    constructor(req) {
        this.ID = _GetNextID();
        this.userInfo = UserManager.GetUserInfo(Utils.GetUserAccount(req));
        this.clientIP = Utils.GetClientIP(req);
        this.sessionStartTime = new Date();
        this.lastHeartBeatTime = new Date();
    }

    GetLastHeartBeatTime() {
        return this.lastHeartBeatTime.getTime();
    }

    TryUpdateHeartBeatTime(req){
        if (Utils.GetUserAccount(req) != this.userInfo.account) return false;
        if (Utils.GetClientIP(req) != this.clientIP) return false;
        this.lastHeartBeatTime = new Date();
        return true;
    }

    GetID() { return this.ID; }
};

class ArticleSession extends ClientSession {
    constructor(req) {
        super(req);
    };

    Open(fileName) { return false; }
    Delete() { return false; }
    Save(content) { return false; }

    GetFileName() { return null;}
    GetTitle() { return null;}
    GetAuthor() { return null;}
    GetCategoryName() { return null;}
    GetLayout() { return null;}
    GetAllowHistory() { return null;}
    GetSecret() { return null; }
    GetContent() { return null; }
    GetID() { return null; }

    SetTitle(v) { }
    SetAuthor(v) { }
    SetCategoryName(v) { }
    SetLayout(v) { }
    SetAllowHistory(b) { }
    SetSecret(b) { }
}

class FullAuthorizedSession extends ArticleSession {
    constructor(req){
        super(req);
    };

    Open(fileName) {
        if (typeof fileName != "string") return false;

        if (ArticleHandler.HasConfig(fileName)) {
            this.m_articleConfig = ArticleHandler.GetConfig(fileName);
        } else {
            this.m_articleConfig = ArticleHandler.CreateArticleProxy(fileName, this.userInfo.account);
            this.m_articleConfig.SetAuthor(this.userInfo.displayName);
        }
        return true;
    }

    Delete() {
        return ArticleHandler.Delete(this.m_articleConfig);
    }

    Save(content) {
        if (!ArticleHandler.Add(this.m_articleConfig, content)) {
            return ArticleHandler.Modify(this.m_articleConfig, content);
        }
        return false;
    }

    GetFileName() { return this.m_articleConfig.GetFileName(); }
    GetTitle() { return this.m_articleConfig.GetTitle(); }
    GetAuthor() { return this.m_articleConfig.GetAuthor(); }
    GetCategoryName() { return this.m_articleConfig.GetCategoryName(); }
    GetLayout() { return this.m_articleConfig.GetLayout(); }
    GetAllowHistory() { return this.m_articleConfig.GetAllowHistory(); }
    GetSecret() { return this.m_articleConfig.GetSecret(); }
    GetContent() { return this.m_articleConfig.GetContent(); }
    GetID() { return this.m_articleConfig.GetFileName(); }

    SetTitle(v) { this.m_articleConfig.SetTitle(v);}
    SetAuthor(v) { this.m_articleConfig.SetAuthor(v);}
    SetCategoryName(v) { this.m_articleConfig.SetCategoryName(v);}
    SetLayout(v) { this.m_articleConfig.SetLayout(v);}
    SetAllowHistory(b) { this.m_articleConfig.SetAllowHistory(b);}
    SetSecret(b) { this.m_articleConfig.SetSecret(b);}
}

class CreatorOnlySession extends FullAuthorizedSession {
    constructor(req) {
        super(req);
    };

    Open(fileName) {
        if (typeof fileName != "string") return false;

        let _proxy = ArticleHandler.GetConfig(fileName);
        if (_proxy) {
            if (_proxy.GetCreatorAccount() != this.userInfo.account) {
                return false;
            }
        }

        return super.Open(fileName);
    }
}


class FileManageSession extends ClientSession {
    constructor(acc, ip){
        super(acc, ip);
    };

    Delete(relativePath, fileName) {
    }

    Save(){
    }
}

const s_heartBeatInternal = 20000;
let s_connectionCheck = null;

class SessionManager {
    _StartHearBeatCheck() {
        if (s_connectionCheck) return;

        let _removeArray = [];
        let _map = this.m_mapSession;
        s_connectionCheck = setInterval(() => {
            _map.forEach((s, key, _map) => {
                const _delta = new Date().getTime() - s.GetLastHeartBeatTime();
                LOG.Info("delta:%d", _delta);
                if (_delta > s_heartBeatInternal) {
                    LOG.Info("delete session");
                    _removeArray.push(key);
                }
            });

            if (_removeArray.length > 0) {
                _removeArray.forEach((value) => {
                    _map.delete(value);
                });
                _removeArray.length = 0;
            }

            if (_map.size <= 0) {
                if (s_connectionCheck != null) {
                    clearInterval(s_connectionCheck);
                    s_connectionCheck = null;
                }
            }
        }, s_heartBeatInternal);
        return true;
    }

    constructor() {
        this.m_mapSession = new Map();
    }

    /**
     * factory method;
     */
    Create(req) {
        let _s = null;
        const _acc = UserManager.GetUserInfo(Utils.GetUserAccount(req));
        switch (_acc.authorization) {
            case constant.authorization.FULL_AUTHORIZED:
                _s = new FullAuthorizedSession(req);
                break;
            case constant.authorization.CREATOR_ONLY:
                _s = new CreatorOnlySession(req);
                break;
            default:
                _s = new ArticleSession(req);/// no rights session, just for uniform structure.
        }
        return _s;
    }

    Push(session){
        if (session instanceof ClientSession) {
            this.m_mapSession.set(session.GetID(), session);
            this._StartHearBeatCheck();
            return true;
        }
        return false;
    }

    Pop(session) {
        if (session instanceof ClientSession) {
            this.m_mapSession.delete(session.GetID());
            return true;
        }
        return false;
    }

    Get(sessionID) {
        let _es = this.m_mapSession.get(sessionID);
        return _es ? _es : null;
    }
}

var mgr = new SessionManager();

/**
 * MUST return a session;
 */
module.exports.Create = function (req) { return mgr.Create(req); }
module.exports.Push = function (session) { return mgr.Push(session); }
module.exports.Pop = function (session) { return mgr.Pop(session); }
module.exports.Get = function (sessionID) { return mgr.Get(sessionID); }