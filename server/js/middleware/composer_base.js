const MARKED = require("marked");
const EJS = require("ejs");

const pathes = require("../pathes");
const LOG = require(pathes.pathJS + 'debug_logger');
const Utils = require(pathes.pathJS + "utils");
const aco = require(pathes.pathJS + "article_config_organizer");
const FileFolderHandler = require(pathes.pathJS + 'file_folder_handler');

class ComposerBase {
  constructor() {
    //LOG.Info("%s,%s", tplFolderPath, articleFolderPath);
    this.articleFolderPath = pathes.pathArticle;
    this.articleListURL = pathes.pathTemplate + "template_article_list.ejs";
    this.article404URL = pathes.pathTemplate + "template_article_404.ejs";
    this.editorHtmlURL = pathes.pathTemplate + "template_editor.ejs";
    this.loginHtmlURL = pathes.pathTemplate + "template_login.ejs";
    this.indexURL = pathes.pathTemplate + "template_index.ejs";
    this.projectHtmlURL = Object.create(null);
    this.projectHtmlURL.webgl = pathes.pathTemplate + "project/template_webgl.ejs";
    this.projectHtmlURL.duck = pathes.pathTemplate + "project/template_duck.ejs";
    this.projectHtmlURL.blog = pathes.pathTemplate + "project/template_blog.ejs";
    this.projectHtmlURL.lsx = pathes.pathTemplate + "project/template_lsx.ejs";
    this.projectHtmlURL.coper = pathes.pathTemplate + "project/template_coper.ejs";
  };

  ComposeIndexHtml(obj, req, res) {
    this.RenderEjs(this.indexURL, obj, res);
  };

  ComposeArticleWithFileName(fileName, req, res) {
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
        this.RenderEjs(tplFileURL, { obj: obj }, res);
      }
    });
  };

  RenderEjs(tplUrl, obj, res) {
    EJS.renderFile(tplUrl, obj, (err, html) => {
      if (err) {
        LOG.Error(err, html);
        res.end("render file error!");
      } else {
        res.end(html);
      }
    });
  }


  ComposeArticle404(fileName, res) {
    const obj = { fileName: fileName };
    this.RenderEjs(this.article404URL, { obj: obj }, res);
  };

  LoginFirst(req, res) {
    this.RenderEjs(this.loginHtmlURL, {}, res);
  };

};

module.exports = ComposerBase;
