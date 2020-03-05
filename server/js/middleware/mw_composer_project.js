const common = require("../common");
const pathes = common.pathes;
var Base = require(pathes.pathMW + "composer_base");
const LOG = require(pathes.pathJS + 'debug_logger');
const Utils = require(pathes.pathJS + "utils");

class ComposerProject extends Base {
  constructor() {
    super();
    this.projectHtmlURL = Object.create(null);
    this.projectHtmlURL.webgl = pathes.pathTemplate + "project/template_webgl.ejs";
    this.projectHtmlURL.duck = pathes.pathTemplate + "project/template_duck.ejs";
    this.projectHtmlURL.blog = pathes.pathTemplate + "project/template_blog.ejs";
    this.projectHtmlURL.lsx = pathes.pathTemplate + "project/template_lsx.ejs";
    this.projectHtmlURL.coper = pathes.pathTemplate + "project/template_coper.ejs";
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
