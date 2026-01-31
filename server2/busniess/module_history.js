const Base = require("./module_busniess_base");
const Result = require("../core/basic").Result;
const Authorization = require("../authorization/module_authorization");
const Utils = require("../core/utils");
const HistoryTemplate = require("./template_history");

class ModuleHistory extends Base {
    constructor() {
        super();
        this.template = new HistoryTemplate();
    }

    HandleGetRequest(req, res) {
        let _out = {};
        Authorization.GetAuthority(req, _out);
        if (_out.data.FetchHistory(_out) > 0) {
            const _list = _out.data;
            let _html = this.template.Generate(_list);
            res.end(_html);
        } else {
            this.ComposeInfoboard(req, res, `There is NO such category name. go back <a href="/">home.</a>`);
        }
    }
}

let mw = new ModuleHistory();

module.exports.get = (req, res) => {
    mw.HandleGetRequest(req, res);
}
