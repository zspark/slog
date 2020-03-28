const EJS = require("ejs");

const common = require("../common");
const pathes = common.pathes;
const LOG = require(pathes.pathCore + 'logger');
const TPLGEN = require(pathes.pathCore + "template_generator");

class ModuleBase {
  constructor() {
  };

  _GetFileURL(category, fileName) {
    return pathes.pathArticle + category + "/" + fileName;
  }

  RenderEjs(req, res, tplUrl, obj) {
    EJS.renderFile(tplUrl, obj, (err, html) => {
      if (err) {
        LOG.Error(err, html);
        res.end("render file error!");
      } else {
        res.end(html);
      }
    });
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
