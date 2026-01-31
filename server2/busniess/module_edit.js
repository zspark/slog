const Base = require("./module_busniess_base");
const Result = require("../core/basic").Result;
const ErrorCode = require("../core/basic").ErrorCode;
const ActionCode = require("../core/basic").ActionCode;
const Authorization = require("../authorization/module_authorization");
const Utils = require("../core/utils");
const EditTemplate = require("./template_login");

class ModuleEdit extends Base {
    _GetTemplateList(firstEle) {
        let _list = [];
        _list.push(firstEle);
        constant.M_TEMPLATE_LIST.forEach(template => {
            if (template != firstEle) {
                _list.push(template);
            }
        });
        return _list;
    }

    constructor() {
        super();
        this.template = new EditTemplate();
    };

    GetPreviewHtmlHandler(req, res) {
        let _html = TPLGEN.GenerateHTMLPreview();
        res.end(_html);
    }

    _GetHandler(req, res) {
        this.LogInfo("edit get handler.");
        const _fileName = req.query.n;

        /*
        let _es = SessionMgr.Get(_fileName);
        if (_es) {
            this.ComposeInfoboard(req, res, `This article is currently editing by someone!`);
            return true;
        }

        let _s = SessionMgr.Create(req);
        if (!_s.Open(_fileName)) {
            this.ComposeInfoboard(req, res, `You have NO rights to edit this article!`);
            /// let _s instance alone ,it will be gced for a moment!
            return true;
        }
        SessionMgr.Push(_s);
         */

        let _html = this.template.Generate(
            _s.GetContent(),
            _s.GetTitle(),
            _s.GetAuthor(),
            _s.GetCategoryName(),
            _s.GetAllowHistory(),
            this._GetTemplateList(_s.GetLayout())
        );
        res.end(_html);

        return true;
    };

    HandlePostArticle(req, res) {
        let _obj = this.CreateDefaultResponseObject();

        do {
            const _fileName = req.query.n;
            if (!_fileName) {
                obj.code = constant.error_code.NO_FILE_NAME;
                break;
            }

            let _es = SessionMgr.Get(_fileName);
            if (!_es) {
                _obj.code = constant.error_code.SERVER_SHUT_DOWN;
                break;
            }

            let _jsonObj = req.body;
            if (!_jsonObj) {
                _obj.code = constant.error_code.REQUESTING_FORMAT_ERROR;
                break;
            }

            let _Save = function () {
                _es.SetTitle(_jsonObj.title);
                _es.SetAuthor(_jsonObj.author);
                _es.SetCategoryName(_jsonObj.category);
                _es.SetLayout(_jsonObj.template);
                _es.SetAllowHistory(_jsonObj.allowHistory);
                _es.Save(_jsonObj.content);
            }

            const action_code = constant.action_code;
            const error_code = constant.error_code;
            switch (_jsonObj[constant.M_ACTION]) {
                case action_code.HEART_BEAT:
                    if (_es.TryUpdateHeartBeatTime(req)) {
                        this.LogInfo("heart beat");
                    } else {
                        _obj.code = error_code.SERVER_SHUT_DOWN;
                        SessionMgr.Pop(_es);
                    }
                    break;
                case action_code.DELETE:
                    _es.Delete();
                    SessionMgr.Pop(_es);
                    _obj.redirectURL = "/";
                    break;
                case action_code.SAVE:
                    _Save();
                    break;
                case action_code.SAVE_AND_EXIT:
                    _Save();
                    SessionMgr.Pop(_es);
                    _obj.redirectURL = `view?n=${_fileName}`;
                    break;
                case action_code.CANCEL:
                    SessionMgr.Pop(_es);
                    _obj.redirectURL = `view?n=${_fileName}`;
                    break;
                default:
                    break;
            }

        } while (false)
        res.send(JSON.stringify(_obj));
        return true;
    };

    _LoginFirst(req, res) {
        const _fileName = req.query.n;
        if (_fileName) {
            let _url = Utils.MakeLoginWithViewURL(_fileName);
            res.redirect(_url);
        } else {
            let _url = Utils.MakeLoginURL();
            res.redirect(_url);
        }
    };


    HandleGetRequest(req, res) {
        if (Utils.CheckLogin(req)) {
            const _fileName = req.query.n;
            if (_fileName) {
                this._GetHandler(req, res);
            } else {
                let _msg = "no assigned file name!";
                this.LogInfo(_msg);
                res.end(_msg);
            }
        } else {
            this._LoginFirst(req, res);
        }
    }

    HandlePostRequest(req, res) {
        let post = function (req, res) {
            if (Utils.CheckLogin(req)) {
                HandlePostArticle(req, res);
            } else {
                this._LoginFirst(req, res);
            }
        };
    }
}

let mw = new ModuleEdit();

module.exports.get = (req, res) => {
    mw.HandleGetRequest(req, res);
}
module.exports.post = (req, res) => {
    mw.HandlePostRequest(req, res);
}
