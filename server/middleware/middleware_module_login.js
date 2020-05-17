const common = require("../core/common");
const pathes = common.pathes;
const constant = common.constant;
var Base = require(pathes.pathMW + "middleware_module_base");
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const UserManager = require(pathes.pathCore + "user_manager");
const TPLGEN = require(pathes.pathCore + "template_generator");

class ModuleLogin extends Base {
    constructor() {
        super();
    };

    GetHandler(req, res) {
        const _fileName = req.query.n;
        let _html = TPLGEN.GenerateHTMLLogin(_fileName);
        res.end(_html);
    }

    PostHandler(req, res) {

        let _obj = {
            resTime: new Date(),
            code: constant.UNKNOWN,
            redirectURL: "/",
        };


        let _data = req.body;
        const _account = _data["account"];
        const _userInfo = UserManager.GetUserInfo(_account);
        if (_userInfo) {
            const _pwd = _data["password"];
            if (_userInfo.password === _pwd) {
                res.cookie("account", _userInfo.account, { signed: true });//read cookies:(req.signedCookies.bwf) 
                _obj.code = constant.action_code.ACTION_CONFIRMED;
                const _q = Utils.GetQueryValues(req);
                const _fileName = _q.fileName;
                if (_fileName) {
                    _obj.redirectURL = Utils.MakeEditURL(_fileName);
                }

            } else {
                let _info = "Sorry wrong password!";
                _obj.code = constant.error_code.WRONG_PWD;
                LOG.Error(_info);
            }
        } else {
            let _info = "Sorry wrong account! account:" + _account;
            _obj.code = constant.error_code.WRONG_ACCOUNT;
            LOG.Error(_info);
        }

        res.send(JSON.stringify(_obj));
    };
};

function Init() {
    let mw = new ModuleLogin();

    let get = function (req, res) {
        mw.GetHandler(req, res);
    };

    let post = function (req, res) {
        mw.PostHandler(req, res);
    };

    return { get: get, post: post };
};

module.exports.Init = Init;
