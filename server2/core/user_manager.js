const {Group, Result, GlobalPaths} = require("../core/basic");
const IOSystem = require("./io_system");
const Utils = require("./utils");
const Log = require("../core/logger");

let users = new Group("users");
let version = "";
let manager = null;
let visitor = null;

class AccountPrivilege {
    constructor() {
        this.allowCreate = false;
        this.allowDeleteSelf = false;
        this.allowDeleteOthers = false;
        this.allowModifySelf = false;
        this.allowModifyOthers = false;
        this.allowView = false;
        this.allowSearch = false;
        this.allowReadingHistory = false;
    }
}

class Account {
    constructor(id, p, rTime) {
        Utils.CreateProperty(this, "id", id, false, false, false);
        Utils.CreateProperty(this, "pwd", p, false, false, false);
        Utils.CreateProperty(this, "registedTime", new Date(rTime), false, false, false);
        this.displayName = "";
        this.lastLoginTime = null;
        this.loginCount = 0;
        this.privilege = new AccountPrivilege();
    }

    GetPrivilege() {
        return this.privilege;
    }

    Check(pwd) {
        return this.pwd === pwd;
    }
}

let Init = function () {
    const _userFileURL = GlobalPaths.ROOT_SERVER + "users.json";
    if (!IOSystem.FileExist(_userFileURL)) {
        Log.Error("There is NO user config file!");
        return;
    }

    let _config = JSON.parse(IOSystem.ReadFileUTF8(_userFileURL));
    version = _config.version;
    for (let i = 0, N = _config.users.length; i < N; ++i) {
        const _tmp = _config.users[i];
        let _acc = new Account(_tmp.id, _tmp.password, _tmp.registedTime);
        _acc.displayName = _tmp.displayName;
        _acc.lastLoginTime = new Date(_tmp.lastLoginTime);
        _acc.loginCount = _tmp.loginCount;
        _acc.privilege.allowCreate = _tmp.allowCreate;
        _acc.privilege.allowDeleteSelf = _tmp.allowDeleteSelf;
        _acc.privilege.allowDeleteOthers = _tmp.allowDeleteOthers;
        _acc.privilege.allowModifySelf = _tmp.allowModifySelf;
        _acc.privilege.allowModifyOthers = _tmp.allowModifyOthers;
        _acc.privilege.allowView = _tmp.allowView;
        _acc.privilege.allowSearch = _tmp.allowSearch;
        users.AddItem(_acc.id, _acc);
    }
    manager = users.GetItem(_config.manager);

    const _v = _config.visitor;
    visitor = new Account("visitor", "visitor", new Date().toISOString());
    visitor.privilege.allowCreate = _v.allowCreate;
    visitor.privilege.allowDeleteSelf = _v.allowDeleteSelf;
    visitor.privilege.allowDeleteOthers = _v.allowDeleteOthers;
    visitor.privilege.allowModifySelf = _v.allowModifySelf;
    visitor.privilege.allowModifyOthers = _v.allowModifyOthers;
    visitor.privilege.allowView = _v.allowView;
    visitor.privilege.allowSearch = _v.allowSearch;
}()

module.exports.GetAccountPrivilege = (id, out) => {
    let _acc = users.GetItem(id);
    if (_acc) {
        out.data = _acc.GetPrivilege();
        return Result.OK;
    } else {
        out.msg = `there is No such account with id:${id}`;
        return Result.ACCOUNT_NOT_EXIST;
    }
}
module.exports.GetAccountDisplayName = (id, out) => {
    let _acc = users.GetItem(id);
    if (_acc) {
        out.data = _acc.displayName;
        return Result.OK;
    } else {
        out.msg = `there is No such account with id:${id}`;
        return Result.ACCOUNT_NOT_EXIST;
    }
}
module.exports.GetVisitorPrivilege = () => {
    return visitor.GetPrivilege();
}
module.exports.UpdateLoginTime = (id) => {
    let _acc = users.GetItem(id);
    if (_acc) {
        _acc.lastLoginTime = new Date();
        return Result.OK;
    }
    return Result.ACCOUNT_NOT_EXIST;
}
