const pathes = require("../pathes");
const LOG = require(pathes.pathJS+'debug_logger');
const Utils = require(pathes.pathJS+"utils");
const File= require(pathes.pathJS+'file_folder_handler');
var Base = require(pathes.pathMW+"composer_base");

class ComposerGallery extends Base {
  constructor() {
    super();
    this.galleryFolderPath = pathes.pathGallery;
    this.galleryFileURL = pathes.pathTemplate + "template_gallery.ejs";
    this.imagePathRelativeToPublic = "/share/gallery/";
    this.thumbnailPathRelativeToPublic = "/share/gallery/thumbnail/";
    this.thumbnailSuffix = ".thumbnail.jpg";
  };


  ComposeGalleryHtml(res) {
    var arr = File.ReadAllFileNamesInFolder(this.galleryFolderPath);

    var objArr=[];
    arr.forEach(item => {
      objArr.push({
        imagePath: this.imagePathRelativeToPublic + item,
        thumbnailPath: this.thumbnailPathRelativeToPublic + item + this.thumbnailSuffix,
      });  
    });
    this.RenderEjs(this.galleryFileURL, { obj: objArr }, res);
  };
}

function GalleryHtmlComposer() {
  let mw = new ComposerGallery();

  return function (req, res) {
    mw.ComposeGalleryHtml(res);
  }
};

module.exports.GalleryHtmlComposer = GalleryHtmlComposer;
