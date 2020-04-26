const common = require("./common");
const pathes = common.pathes;
const constant = common.constant;
const LOG = require(pathes.pathCore + 'logger');
const IOSystem = require(pathes.pathCore + 'io_system');
const Utils = require(pathes.pathCore + "utils");
const ArticleHandler = require(pathes.pathCore + "article_handler");
const UserManager = require(pathes.pathCore + "user_manager");

class ClientSession {
    static #s_nextID = 0;
    static GetNextID() {
        return ClientSession.#s_nextID++;
    };


    #ID;
    #editingAccount;
    #editingIP;
    #editingStartTime;
    #editingLastHeartBeatTime;

    _Validate(account, ip) {
        if (account != this.#editingAccount) return false;
        if (ip != this.#editingIP) return false;
        return true;
    }

    constructor(account, ip) {
        this.#ID = ClientSession.GetNextID();
        this.#editingAccount = account;
        this.#editingIP = ip;
        this.#editingStartTime = new Date();
        this.#editingLastHeartBeatTime = new Date().getTime();
    }

    GetLastHeartBeatTime() {
        return this.#editingLastHeartBeatTime;
    }

    TryUpdateHeartBeatTime(acc, ip) {
        if (this._Validate(acc, ip)) {
            this.#editingLastHeartBeatTime = new Date().getTime();
            return true;
        }
        return false;
    }

    GetID() {
        return this.#ID;
    }
};

class EditSession extends ClientSession {

    #m_articleConfig;
    constructor(acc, ip, fileName) {
        super(acc, ip);

        this.#m_articleConfig = ArticleHandler.GetConfig(fileName);
        if (!this.#m_articleConfig) {
            this.#m_articleConfig = ArticleHandler.CreateConfig(fileName);
        }
    };

    Delete() {
        ArticleHandler.Delete(this.#m_articleConfig);
    }

    Save(content) {
        if (!ArticleHandler.Add(this.#m_articleConfig, content)) {
            ArticleHandler.Modify(this.#m_articleConfig, content);
        }
    }

    GetFileName() { return this.#m_articleConfig.GetFileName(); }
    GetTitle() { return this.#m_articleConfig.GetTitle(); }
    GetAuthor() { return this.#m_articleConfig.GetAuthor(); }
    GetCategory() { return this.#m_articleConfig.GetCategory(); }
    GetLayout() { return this.#m_articleConfig.GetLayout(); }
    GetAllowHistory() { return this.#m_articleConfig.GetAllowHistory(); }
    GetSecret() { return this.#m_articleConfig.GetSecret(); }
    GetContent() {
        const _fileURL = pathes.pathArticle + this.#m_articleConfig.GetFileName();
        let _c = IOSystem.ReadFileUTF8(_fileURL);
        return _c == null ? "" : _c;
    }

    SetTitle(v) { this.#m_articleConfig.SetTitle(v);}
    SetAuthor(v) { this.#m_articleConfig.SetAuthor(v);}
    SetCategory(v) { this.#m_articleConfig.SetCategory(v);}
    SetLayout(v) { this.#m_articleConfig.SetLayout(v);}
    SetAllowHistory(b) { this.#m_articleConfig.SetAllowHistory(b);}
    SetSecret(b) { this.#m_articleConfig.SetSecret(b);}

    GetID() {
        return this.#m_articleConfig.GetFileName();
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

class SessionManager {
    static #m_heartBeatInternal = 20000;

    _StartHearBeatCheck() {
        if (this.#m_connectionCheck != null) return false;

        let _removeArray = [];
        let _map = this.#m_mapEditSession;
        this.#m_connectionCheck = setInterval(() => {
            _map.forEach((value, key, _map) => {
                let _delta = new Date().getTime() - value.GetLastHeartBeatTime();
                LOG.Info("delta:%d", _delta);
                if (_delta > SessionManager.#m_heartBeatInternal) {
                    LOG.Info("delete session");
                    _removeArray.push(key);
                }
            });

            _removeArray.forEach((value) => {
                _map.delete(value);
            });
            _removeArray.length = 0;

            if (_map.size <= 0) {
                if (this.#m_connectionCheck != null) {
                    clearInterval(this.#m_connectionCheck);
                    this.#m_connectionCheck = null;
                }
            }
        }, SessionManager.#m_heartBeatInternal);
        return true;
    }

    #m_mapEditSession;
    #m_connectionCheck;

    constructor() {
        this.#m_mapEditSession = new Map();
        this.#m_connectionCheck = null;
    }

    CreateEditSession(req, res) {
        /// TODO:create session instance according to user's rights;
        let _es = new EditSession(Utils.GetUserAccount(req), Utils.GetClientIP(req), req.query.n);
        this.#m_mapEditSession.set(_es.GetID(), _es);
        this._StartHearBeatCheck();
        return _es;
    }

    Delete(session) {
        if (session) {
            this.#m_mapEditSession.delete(session.GetID());
        }
    }

    Get(sessionID) {
        let _es = this.#m_mapEditSession.get(sessionID);
        return _es ? _es : null;
    }
}

var mgr = new SessionManager();

module.exports = mgr;