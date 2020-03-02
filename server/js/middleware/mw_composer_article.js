const pathes = require("../pathes");
const LOG = require(pathes.pathJS + 'debug_logger');
const Utils = require(pathes.pathJS + "utils");
const aco = require(pathes.pathJS + "article_config_organizer");
var Base = require(pathes.pathMW + "composer_base");

class ComposerArticle extends Base {
  constructor() {
    super();
  };

  ComposeArticleList(req, res) {
    const categoryName = Utils.GetQueryValue(req, "category");
    if (categoryName) {
      let _list = aco.GetCategory(categoryName);
      if (!_list) { _list = []; }
      let obj = [];
      _list.map(_fileName => {
        let _cfg = aco.GetConfig(_fileName);
        obj.push({
          "fileName": _fileName,
          "displayName": _cfg["displayName"],
          "displayTime": new Date(_cfg["createTime"]).toDateString()
        });
      });
      this.RenderEjs(this.articleListURL, { obj: obj }, res);
    } else {
      let _info = "please enter your category name";
      LOG.Error(_info);
      res.end(_info);
    }
  };
};


function ArticleHtmlComposer() {
  let mw = new ComposerArticle();

  let get = function (req, res) {
    const _fileName = Utils.GetQueryValue(req, "fileName");
    if (_fileName) {
      if (aco.GetConfig(_fileName)) {
        mw.ComposeArticleWithFileName(_fileName, req, res);
      } else {
        mw.ComposeArticle404(_fileName, res);
      }
    } else {
      mw.ComposeArticleList(req, res);
    };
  };
  let post = function (req, res) {
    res.end("bad post");
  };

  return { get: get, post: post };
};

module.exports.ArticleHtmlComposer = ArticleHtmlComposer;
