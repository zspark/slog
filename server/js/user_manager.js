const pathes = require("./pathes");
const LOG = require(pathes.pathJS+'debug_logger');
const FileFolderHandler = require(pathes.pathJS+'file_folder_handler');

var userMap = new Map();

var Init = function () {
  let files = FileFolderHandler.ReadAllFileNamesInFolder(pathes.pathUser);
	//LOG.Info(files);
	files.map(file => {
    //LOG.Info(file);
    let data = FileFolderHandler.ReadFileUTF8(pathes.pathUser + file);
    if(data){
      LOG.Info("user config file loaded: %s", pathes.pathUser + file);
      data = JSON.parse(data);
      userMap[data.account] = data;
    //console.log(data);
    }
	});
}();

var GetUserInfo = function (account) {
  return userMap[account];
};

module.exports.GetUserInfo = GetUserInfo;
