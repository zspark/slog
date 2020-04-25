const express = require('express');

const pathes = require("./core/common").pathes;
const mwMarket = require(pathes.pathMW + "middleware_market");

var mainApp = express();
mainApp.use(express.static(pathes.pathClient));// for site js and css
mainApp.use(express.static(pathes.pathContent));// for custom content. e.g. articles imgs zips etc.
mwMarket(mainApp);
mainApp.listen(8080, () => console.log("server is now listening port: 8080"));


