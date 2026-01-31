const Base = require("./module_busniess_base");
const Result = require("../core/basic").Result;
const Authorization = require("../authorization/module_authorization");
const Utils = require("../core/utils");
const SearchTemplate = require("./template_search");

class ModuleSearch extends Base {
    constructor() {
        super();
        this.template = new SearchTemplate();
    }

    HandleGetRequest(req, res) {
        let _html = this.template.Generate();
        res.end(_html);
    }

    HandlePostRequest(req, res) {
        let _out = {};
        Authorization.GetAuthority(req, _out);
        let _jsonObj = req.body;
        if (_out.data.SearchContent(_jsonObj.content, _out) > 0) {
            /*
              _obj=
              [
                {fileName:"xxx",content:"sfsfsf"},// content for show ,fileName for link
                {fileName:"xxx",content:"sfsfsf"}
              ]
             */
            let _html = this.template.GenerateSearchContent(_out.data);
            res.end(_html);
        } else {
            this.ComposeInfoboard(req, res, _out.msg);
        }
    }
}

let mw = new ModuleSearch();

module.exports.get = (req, res) => {
    mw.HandleGetRequest(req, res);
}
module.exports.post = (req, res) => {
    mw.HandlePostRequest(req, res);
}
