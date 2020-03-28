const EJS = require("ejs");

const common = require("../common");
const pathes = common.pathes;
const LOG = require(pathes.pathCore + 'logger');

class ModuleBase {
  constructor() {
    this.infoboardHtmlURL = pathes.pathTemplate + "template_infoboard.ejs";
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

  ComposeInfoboard(req, res, msg) {
    this.RenderEjs(req, res, this.infoboardHtmlURL, { info: msg });
  }
};

module.exports = ModuleBase;
