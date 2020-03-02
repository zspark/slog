const pathes = require("../pathes");
const LOG = require(pathes.pathJS + 'debug_logger');
const Utils = require(pathes.pathJS + "utils");
const FileFolderHandler = require(pathes.pathJS + 'file_folder_handler');
const aco = require(pathes.pathJS + "article_config_organizer");
var Base = require(pathes.pathMW + "composer_base");

class ComposerEditor extends Base {
  constructor() {
    super();
  };

  GetHandler(req, res) {
    const _fileName = Utils.GetQueryValue(req, "fileName");
    if (_fileName) {
      //Utils.SetCookie(req, "fileName",_fileName);
      let obj = {
        "fileName": _fileName,
        "author": "Jerry Chaos",
        "category": "default",
        "displayName": "",
        "content": "",
      };
      var _cfg = aco.GetConfig(_fileName);
      if (_cfg) {
        obj["author"] = _cfg["author"];
        obj["category"] = _cfg["category"];
        obj["displayName"] = _cfg["displayName"];
      }
      const fileURL = this.articleFolderPath + _fileName;
      let _content = FileFolderHandler.ReadFileUTF8(fileURL);
      if (_content != null) {
        obj["content"] = _content;
      }
      this.RenderEjs(this.editorHtmlURL, { obj: obj }, res);
    } else {
      res.end("no assigned file name!");
    };
  };

  PostHandler(req, res) {
    //console.log(req.body);
    const _fileName = Utils.GetQueryValue(req,"fileName");
    const _content = req.body.content;

    // cancel modify
    if (_content == null) {
      if (aco.GetConfig(_fileName)) {
        let _url = Utils.MakeArticleURL(_fileName);
        res.redirect(_url);
      } else {
        let _url = Utils.MakeHomeURL(null);
        res.redirect(_url);
      }
      return;
    }

    // delete
    if (_content.trim() == "delete") {
      aco.Delete(_fileName);
      let _url = Utils.MakeHomeURL(null);
      res.redirect(_url);
      return;
    }

    // save
    const _title = req.body.title;
    const _author = req.body.author;
    const _category = req.body.category;
    if (aco.GetConfig(_fileName)) {
      aco.Modify(_fileName, _category, _title, _content);
    } else {
      aco.Add(_fileName, _category, _title, _content);
    }
    let _url = Utils.MakeArticleURL(_fileName);
    res.redirect(_url);
  };

  LoginFirst(req, res) {
    this.RenderEjs(this.loginHtmlURL, {}, res);
  };

};

function EditorHtmlComposer() {
  let mw = new ComposerEditor();

  let get = function (req, res) {
    if (Utils.CheckLogin(req)) {
      mw.GetHandler(req, res);
    } else {
      mw.LoginFirst(req, res);
    }
  };
  let post = function (req, res) {
    if (Utils.CheckLogin(req)) {
      mw.PostHandler(req, res);
    } else {
      mw.LoginFirst(req, res);
    }
  };
  return { get: get, post: post };
};

module.exports.EditorHtmlComposer = EditorHtmlComposer;
