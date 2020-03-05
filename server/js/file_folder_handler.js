const FS = require('fs');

const common = require("./common");
const pathes = common.pathes;
const LOG = require(pathes.pathJS+'debug_logger');

/**
 * load a file from local disk
 * if file exist callback later (with file content as parameter),
 * otherwise callback instantly (with null as parameter).
 * @param {string} fileURL 
 * @param {Function} cb A callback function with one parameter.
 * @returns {void} 
 */
var ReadFileUTF8_async = function (fileURL, cb) {
  if (FS.existsSync(fileURL)) {
    LOG.Info("file EXIST:", fileURL);
    FS.readFile(fileURL, "utf8", (err, data) => {
      if (err) {
        LOG.Error("file loading error: %s", err);
        cb(null);
      }else{
        cb(data);
      }
    });
  } else {
    LOG.Warn("file NOT exist: %s", fileURL);
    cb(null);
  }
};

/**
 * load a file from local disk, and return that file if exist,otherwise return null instantly.
 * @param {string} fileURL 
 * @returns {string|null} 
 */
var ReadFileUTF8 = function (fileURL) {
  if (FS.existsSync(fileURL)) {
    let file = FS.readFileSync(fileURL, "utf8");
    return file;
  } else {
    LOG.Warn("file NOT exist: %s", fileURL);
    return null;
  }
};

var FileExist = function (fileURL) {
  return FS.existsSync(fileURL);
};

var ReadAllFileNamesInFolder = function (folderPath, prefix = "") {
  let out = [];
  let files = FS.readdirSync(folderPath);
  files.map(file => {
    const fileURL = folderPath + file;
    let stat = FS.statSync(fileURL);
    if (!stat.isDirectory()) {
      out.push(prefix + file);
    }
  });
  return out;
};

/**
 * if file exist, delete it and return true;
 * otherwise return false;
 * @param {boolean}  
 */
var DeleteFile = function (fileURL) {
  if (FS.existsSync(fileURL)) {
    FS.unlinkSync(fileURL);
    return true;
  } else return false;
};

var WriteFileUTF8 = function (fileURL, data, extension = "") {
  FS.writeFileSync(fileURL + extension, data);
  return true;
};

/**
 * if file saved successfully ,cb(true),
 * otherwise cb(false);
 * @param {string} fileURL 
 * @param {string} data 
 * @param {boolean} cb 
 */
var WriteFileUTF8_async = function (fileURL, data, cb) {
  FS.writeFile(fileURL, data, (err) => {
    if (err) {
      LOG.Error("%s has NOT been saved!", fileURL);
      cb(false)
    } else {
      LOG.Info("%s has been saved", fileURL);
      cb(true);
    }
  });
};

var WriteImage_async = function (fileURL, data, cb) {
  FS.writeFile(fileURL, data, (err) => {
    if (err) {
      LOG.Error("%s has NOT been saved!", fileURL);
      res.redirect("back");
      cb(err);
    } else {
      LOG.Info("%s has been saved", fileURL);
      cb();
    }
  });
}

/*
var LoadFile = function (fileURL) {
	var p = new Promise(function (resove, reject) {
		FS.readFile(fileURL, "utf8", (err, data) => {
			if (err) {
				reject(err, data);
			} else {
				resove(data);
			}
		});
	});
	return p;
};
*/

module.exports.ReadFileUTF8_async = ReadFileUTF8_async;
module.exports.ReadFileUTF8 = ReadFileUTF8;
module.exports.FileExist = FileExist;
module.exports.ReadAllFileNamesInFolder = ReadAllFileNamesInFolder;
module.exports.DeleteFile = DeleteFile;
module.exports.WriteFileUTF8 = WriteFileUTF8;
module.exports.WriteFileUTF8_async = WriteFileUTF8_async;
module.exports.WriteImage_async = WriteImage_async;
