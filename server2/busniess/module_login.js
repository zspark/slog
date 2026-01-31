const Base = require("./module_busniess_base");
const Result = require("../core/basic").Result;
const ErrorCode = require("../core/basic").ErrorCode;
const ActionCode = require("../core/basic").ActionCode;
const LoginTemplate = require("./template_login");
const Authorization = require("../authorization/module_authorization");
const Utils = require("../core/utils");

class ModuleLogin extends Base {
    constructor() {
        super();
        this.template = new LoginTemplate();
    };

    HandleGetRequest(req, res) {
        let _html = this.template.Generate();
        res.end(_html);
    }

    HandlePostRequest(req, res) {
        let _obj = {
            resTime: new Date(),
            code: ErrorCode.UNKNOWN,
            redirectURL: "/",
        };

        let _out = {};
        const ret = Authorization.GetAuthority(req, _out);
        if (ret != Result.VISITOR_ACCOUNT) {
            res.cookie("account", _out.data.accountID, {signed: true});//read cookies:(req.signedCookies.bwf)
            _obj.code = ActionCode.ACTION_CONFIRMED;
            const _fileName = req.query.n;
            if (_fileName) {
                _obj.redirectURL = Utils.MakeEditURL(_fileName);
            }
        } else {
            let _info = `Sorry wrong account OR password!`;
            _obj.code = ErrorCode.WRONG_ACCOUNT;
            this.LogError(_info);
        }

        res.send(JSON.stringify(_obj));
    }
}

let mw = new ModuleLogin();

module.exports.get = (req, res) => {
    mw.HandleGetRequest(req, res);
}
module.exports.post = (req, res) => {
    mw.HandlePostRequest(req, res);
}
