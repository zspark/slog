const pathes = require("../pathes");
var Base = require(pathes.pathMW + "composer_base");
const LOG = require(pathes.pathJS + 'debug_logger');
const Utils = require(pathes.pathJS + "utils");

class ComposerProject extends Base {
  constructor() {
    super();
  };

  ComposeProject_WebGL(req, res) {
    this.RenderEjs(this.projectHtmlURL.webgl, {}, res);
  }

  ComposeProject_duck(req, res) {
    this.RenderEjs(this.projectHtmlURL.duck, {}, res);
  }

  ComposeProject_blog(req, res) {
    this.RenderEjs(this.projectHtmlURL.blog, {}, res);
  }

  ComposeProject_lsx(req, res) {
    this.RenderEjs(this.projectHtmlURL.lsx, {}, res);
  }

  ComposeProject_coper(req, res) {
    this.RenderEjs(this.projectHtmlURL.coper, {}, res);
  }
}

function ProjectHtmlComposer() {
  let mw = new ComposerProject();

  return function (req, res) {
    const _projectName = Utils.GetQueryValue(req, "projectName");
    if(_projectName=="WebGL"){
      mw.ComposeProject_WebGL(req, res);
    } else if (_projectName == "duck") {
      mw.ComposeProject_duck(req, res);
    } else if (_projectName == "blog") {
      mw.ComposeProject_blog(req, res);
    } else if (_projectName == "lsx") {
      mw.ComposeProject_lsx(req, res);
    } else if (_projectName == "coper") {
      mw.ComposeProject_coper(req, res);
    } else {
      let _url = Utils.MakeHomeURL(null);
      res.redirect(_url);
    }
  }

};

module.exports.ProjectHtmlComposer = ProjectHtmlComposer;
