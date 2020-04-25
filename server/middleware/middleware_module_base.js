const common = require("../core/common");
const pathes = common.pathes;
const constant = common.constant;
const LOG = require(pathes.pathCore + 'logger');
const TPLGEN = require(pathes.pathCore + "template_generator");

class ModuleBase {
    constructor() {
    };

    _GetFileURL(category, fileName) {
        return pathes.pathArticle + category + "/" + fileName;
    }

    CreateDefaultResponseObject = function () {
        let _obj = {
            resTime: new Date(),
            code: constant.action_code.ACTION_CONFIRMED,
            redirectURL: null,
            msg: "",
        }
        return _obj;
    }

    ComposeURLFormatError(req, res) {
        res.end("oops!, wrong URL format!");
    };

    ComposeInfoboard(req, res, info) {
        let _html = TPLGEN.GenerateHTMLInfoBoard(info);
        res.end(_html);
    }
};

module.exports = ModuleBase;
