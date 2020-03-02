const pathes = require("../pathes");
const LOG = require(pathes.pathJS+'debug_logger');
const Utils = require(pathes.pathJS+"utils");
var Base = require(pathes.pathMW+"composer_base");

class ComposerIndex extends Base {
  constructor() {
    super();
  };
}

function IndexHtmlComposer() {
  let mw = new ComposerIndex();

  return function (req, res) {
    mw.ComposeIndexHtml({},req,res);
  }

};

module.exports.IndexHtmlComposer = IndexHtmlComposer;
