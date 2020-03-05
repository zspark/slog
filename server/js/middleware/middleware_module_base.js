const MARKED = require("marked");
const EJS = require("ejs");

const common = require("../common");
const pathes = common.pathes;
const LOG = require(pathes.pathJS + 'debug_logger');
const Utils = require(pathes.pathJS + "utils");
const aco = require(pathes.pathJS + "article_config_organizer");
const FileFolderHandler = require(pathes.pathJS + 'file_folder_handler');

class ModuleBase {
  constructor() {
    this.articleListURL = pathes.pathTemplate + "template_article_list.ejs";
    this.article404URL = pathes.pathTemplate + "template_article_404.ejs";
    this.editorHtmlURL = pathes.pathTemplate + "template_editor.ejs";
    this.loginHtmlURL = pathes.pathTemplate + "template_login.ejs";
    this.frontPageURL = pathes.pathTemplate + "template_view_without_title.ejs";
  };

  ComposeArticleWithFileName(req, res, fileName) {
    let _cfg = aco.GetConfig(fileName);
    if (!_cfg) {
      res.end("article config do NOT exist! file name:%s", fileName)
      return;
    }

    let _content = FileFolderHandler.ReadFileUTF8(pathes.pathArticle + fileName);
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
        const obj = {
          "fileName": Utils.CheckLogin(req) ? _cfg["fileName"] : null,/// we judge logged in with file name;
          "displayName": _cfg["displayName"],
          "displayTime": new Date(_cfg["createTime"]).toDateString(),
          "author": _cfg["author"],
          mdHtml: mdHtml
        };
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

  ComposeURLFormatError(req, res){
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
