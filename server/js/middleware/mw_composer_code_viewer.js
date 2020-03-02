const MARKED = require("marked");

const pathes = require("../pathes");
var Base = require(pathes.pathMW + "composer_base");
const LOG = require(pathes.pathJS + 'debug_logger');
const Utils = require(pathes.pathJS + "utils");
const FileFolderHandler = require(pathes.pathJS + 'file_folder_handler');

class ComposerCodeViewer extends Base {
  constructor() {
    super();
    this.codeViewTemplateURL = pathes.pathTemplate + "template_code_viewer.ejs";
  };

  _GetExtension(fileName){
    let _li = fileName.lastIndexOf(".");
    return fileName.substring(_li + 1);
  }

  ComposeCodeViewPage(fileName, req, res) {
    let _content = FileFolderHandler.ReadFileUTF8(pathes.pathCode + fileName);
    if (_content == null) {
      res.end("file NOT exist!");
    } else {
      let _nCtt = "```" + this._GetExtension(fileName) + "\r\n" + _content + "\r\n```";
      MARKED(_nCtt, (err, _htmlContent) => {
        if (err) {
          let _info = "marked parse error! file name:" + fileName;
          LOG.Error(_info);
          res.end(_info);
        } else {
          let _obj = Object.create(null);
          _obj.content = _htmlContent;
          this.RenderEjs(this.codeViewTemplateURL, { obj: _obj }, res);
        }
      });
    }
  };
};


function CodeViewerHtmlComposer() {
  let mw = new ComposerCodeViewer();

  let get = function (req, res) {
    const _fileName = Utils.GetQueryValue(req, "fileName");
    if (_fileName) {
      mw.ComposeCodeViewPage(_fileName, req, res);
    } else {
      res.end("no file name assign!");
    };
  };
  let post = function (req, res) {
    res.end("bad post");
  };

  return { get: get, post: post };
};

module.exports.CodeViewerHtmlComposer = CodeViewerHtmlComposer;
