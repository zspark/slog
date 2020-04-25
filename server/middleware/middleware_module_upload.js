const formidable = require('formidable');

const common = require("../core/common");
const pathes = common.pathes;
const constant = common.constant;
var Base = require(pathes.pathMW + "middleware_module_base");
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const IOSystem = require(pathes.pathCore + 'io_system');

class ModuleUpload extends Base {
    constructor() {
        super();
        this.form = formidable({ multiples: true });
        this.form.encoding = 'utf-8';
        this.form.keepExtensions = true;
        this.form.maxFileSize = 2 * 1024 * 1024;
    };

    GetHandler(req, res) {
    };

    PostHandler(req, res) {
        let _uploadFolder = req.query.f;
        if (_uploadFolder[_uploadFolder.length - 1] != '/') _uploadFolder += '/';
        const _uploadPath = pathes.pathUpload + _uploadFolder;
        if (!IOSystem.FolderExist(_uploadPath)) {
            IOSystem.CreateFolder(_uploadPath);
        }

        const _fileName = req.query.n;
        const _uploadURL = _uploadPath + _fileName;

        let _obj = this.CreateDefaultResponseObject();
        if (IOSystem.FileExist(_uploadURL)) {
            _obj.code = constant.action_code.FILE_EXIST;
            res.end(_obj);
            return true;
        }

        this.form.uploadDir = pathes.pathUpload + _uploadFolder;
        this.form.parse(req, (err, fields, files) => {
            if (err) {
                res.end("upload parsing error!");
                return;
            }
            //res.json({ fields, files });


            LOG.Info("done");
        });
    };
};

function Init() {
    let mw = new ModuleUpload();

    let get = function (req, res) {
        mw.GetHandler(req, res);
    };

    let post = function (req, res) {
        mw.PostHandler(req, res);
    };

    return { get: get, post: post };
};

module.exports.Init = Init;
