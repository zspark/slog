const MARKED = require("marked");
const EJS = require("ejs");

const common = require("../common");
const pathes = common.pathes;
const constant = common.constant;
const LOG = require(pathes.pathCore + 'logger');
const Utils = require(pathes.pathCore + "utils");
const CC = require(pathes.pathCore + "content_controller");
const DV = require(pathes.pathCore + 'disk_visitor');

class ModuleBase {
  constructor() {
    this.articleListURL = pathes.pathTemplate + "template_article_list.ejs";
    this.article404URL = pathes.pathTemplate + "template_article_404.ejs";
    this.editorHtmlURL = pathes.pathTemplate + "template_editor.ejs";
    this.loginHtmlURL = pathes.pathTemplate + "template_login.ejs";
    this.frontPageURL = pathes.pathTemplate + "template_view_without_title.ejs";
  };

  ComposeArticleWithFileName(req, res, fileName) {
    let _cfg = CC.GetConfig(fileName);
    if (!_cfg) {
      res.end("article config do NOT exist! file name:%s", fileName)
      return;
    }

    let _content = DV.ReadFileUTF8(pathes.pathArticle + fileName);
    if (_content == null) {
      /// jerry: becarful of empty string; so wo just use ==null to judge;
      res.end("article content do NOT exist! file name:%s", fileName)
      return;
    }

    MARKED(_content, (err, mdHtml) => {
      if (err) {
        let _info = "marked parse error! file name:" + fileName;
        LOG.Error(_info);
        res.end(_info);
      } else {
        ///TODO: to add a default template for article.
        const obj = Object.create(null);
        obj[constant.M_LOGGED_IN] = Utils.CheckLogin(req);
        obj[constant.M_FILE_NAME] = _cfg[constant.M_FILE_NAME];
        obj[constant.M_TITLE] = _cfg[constant.M_TITLE];
        obj[constant.M_CREATE_TIME] = new Date(_cfg[constant.M_CREATE_TIME]).toDateString();
        obj[constant.M_AUTHOR] = _cfg[constant.M_AUTHOR];
        obj["mdHtml"] = mdHtml;

        const tplFileURL = pathes.pathTemplate + _cfg.template;
        this.RenderEjs(req, res, tplFileURL, { obj: obj });
      }
    });
  };

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

  ComposeFrontPageHtml(req, res, obj) {
    this.RenderEjs(req, res, this.frontPageURL, obj);
  };

  ComposeURLFormatError(req, res) {
    res.end("oops!, wrong URL format!");
  };

  ComposeArticle404(req, res, fileName) {
    const obj = { fileName: fileName };
    this.RenderEjs(req, res, this.article404URL, { obj: obj });
  };

  LoginFirst(req, res) {
    this.RenderEjs(req, res, this.loginHtmlURL, {});
  };

};

module.exports = ModuleBase;
