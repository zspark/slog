const express = require('express');

const pathes = require("./js/common").pathes;
const mwMarket = require(pathes.pathMW + "middleware_market");

var mainApp = express();
mainApp.use(express.static(pathes.pathStatic));
mwMarket(mainApp);
mainApp.listen(8080, () => console.log("server is now listening port: 8080"));


