const common = require("../core/common");
const pathes = common.pathes;
const constant = common.constant;
const LOG = require(pathes.pathCore + 'logger');
const TPLGEN = require(pathes.pathLayout + "template_generator");

class ModuleBase {
    constructor() {
    };

    _GetFileURL(category, fileName) {
        return pathes.pathArticle + category + "/" + fileName;
    }

    CreateDefaultResponseObject() {
        let _obj = {
            resTime: new Date(),
            code: constant.action_code.ACTION_CONFIRMED,
            redirectURL: null,
            msg: "",
        }
        return _obj;
    }

    CheckFileName(fileName, obj) {
        if (!fileName) {
            obj.code = constant.error_code.NO_FILE_NAME;
            obj.msg = "error, no file name!";
            return false;
        }
        return true;
    }

    ComposeURLFormatError(req, res) {
        res.end("oops!, wrong URL format!");
    };

    ComposeInfoboard(req, res, info) {
        let _html = TPLGEN.GenerateHTMLInfoBoard(info);
        res.end(_html);
    }

    ComposeFile404(req, res) {
        this.ComposeInfoboard(req, res, `This file is NOT exist,click to <a href="/edit?n=${req.query.n}">create.</a>`);
    };

};

module.exports = ModuleBase;
