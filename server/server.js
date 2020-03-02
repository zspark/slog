//const program = require('commander');
const express = require('express');
//const MD5 = require("md5");
//const MIME = require("mime");
//const compression = require('compression');
//const cookieParser = require('cookie-parser');
//const cookieSession = require('cookie-session');
//const SERVESTATIC = require("serve-static");
//const MORGAN = require("morgan");
//const BODYPARSER = require('body-parser');
//const VHOST = require('vhost');

const pathes = require("./js/pathes");
const mwMarket = require(pathes.pathMW+"middleware_market");
const ArticleCache = require(pathes.pathJS+"article_config_organizer");
const FileFolderHandler = require(pathes.pathJS+'file_folder_handler');
const UserManager = require(pathes.pathJS+"user_manager");

//**************************************************************************************************
// mainApp
var mainApp = express();
mainApp.use(express.static(pathes.pathStatic));
mwMarket(mainApp);
mainApp.listen(8080, () => console.log("server is now listening port: 8080"));


