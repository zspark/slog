const common = require("./common");
const pathes = common.pathes;
const LOG = require(pathes.pathCore + 'logger');
const FileFolderHandler = require(pathes.pathCore + 'disk_visitor');

var userMap = new Map();

var Init = function () {
  let _content = FileFolderHandler.ReadFileUTF8(pathes.urlUsersConfig);
  if (_content == null){
    LOG.Warn("There is NO user config file!");
    return false;
  }
  
  let _userJson = JSON.parse(_content);
  if(_userJson){
    let _N=_userJson.length;
    for(let i=0;i<_N;++i){
      userMap[_userJson[i].account] = _userJson[i];
    }
  }

  return true;
}()

var GetUserInfo = function (account) {
  return userMap[account];
};

module.exports.GetUserInfo = GetUserInfo;
