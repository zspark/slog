const common = require("../core/common");
const pathes = common.pathes;
const constant = common.constant;
const ArticleHandler = require(pathes.pathCore + "article_handler");
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const UserManager = require(pathes.pathCore + "user_manager");
const TPLGEN = require(pathes.pathLayout + "template_generator");
const SessionMgr = require(pathes.pathCore + "client_session");
var Base = require(pathes.pathMW + "middleware_module_base");


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
    };

    GetPreviewHtmlHandler(req, res) {
        let _html = TPLGEN.GenerateHTMLPreview();
        res.end(_html);
    }

    GetHandler(req, res) {
        LOG.Info("edit get handler.");
        const _fileName = req.query.n;

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

        let _html = TPLGEN.GenerateHTMLEdit(
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
            if (!_fileName){
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
                    if (_es.TryUpdateHeartBeatTime(req)){
                        LOG.Info("heart beat");
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
