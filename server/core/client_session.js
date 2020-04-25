const common = require("./common");
const pathes = common.pathes;
const constant = common.constant;
const LOG = require(pathes.pathCore + 'logger');
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
    #editingFileName;
    constructor(acc, ip, fileName) {
        super(acc, ip);
        this.#editingFileName = fileName;
    };

    Delete() {
        ArticleHandler.Delete(this.#editingFileName);
    }

    Save(title, author, category, template, allowHistory, content) {
        const _fileName = this.#editingFileName;
        if (ArticleHandler.GetConfig(_fileName)) {
            ArticleHandler.Modify(_fileName, category, title, author, template, allowHistory, content);
        } else {
            ArticleHandler.Add(_fileName, category, title, author, template, allowHistory, content);
        }
    }

    GetID() {
        return this.#editingFileName;
    }
}

class FileManageSession extends ClientSession {
    constructor(acc, ip){
        super(acc, ip);
    };

    Delete(relativePath, fileName) {
    }

    Save(title, author, category, template, allowHistory, content) {
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

    CreateEditSession(account, ip, fileName) {
        let _es = new EditSession(account, ip, fileName);
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