const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const Log = require("./core/logger");
const GlobalPaths = require("./core/basic").GlobalPaths;
const MWView = require("./busniess/module_view");
const MWLogin = require("./busniess/module_login");
const MWEdit = require("./busniess/module_edit");
const MWSearch = require("./busniess/module_search");
const MWHistory = require("./busniess/module_history");
const hhh = require("./authorization/module_authorization");

/*
const MWUpload = require(pathes.pathMW + "middleware_module_upload");
const MWManage = require(pathes.pathMW + "middleware_module_manage");
const MWQueryLegality = require(pathes.pathMW + "middleware_module_query_legality");
 */

class HTMLServer {
    constructor(port) {
        Log.Info("HTML server starting ...");
        this.mainApp = express();
        this.mainApp.use(express.static(GlobalPaths.ROOT_CLIENT));// for site js and css
        this.mainApp.use(express.static(GlobalPaths.ROOT_CONTENT));// for custom content. e.g. articles imgs zips etc.
        /*
        let MiddlewareLogin = MWLogin.Init();
        let MiddlewareEdit = MWEdit.Init();
        let MiddlewareUpload = MWUpload.Init();
        let MiddlewareManage = MWManage.Init();
        let MiddlewareSearch = MWSearch.Init();
        let MiddlewareQueryLegality = MWQueryLegality.Init();
         */

        //mainApp.use(MiddlewareQueryLegality.use);
        this.mainApp.get("/", MWView.getFrontPage);
        this.mainApp.get("/index", MWView.getFrontPage)
        this.mainApp.get("/index.html", MWView.getFrontPage);
        this.mainApp.get("/search", MWSearch.get);
        this.mainApp.post("/search", bodyParser.json({extended: false, limit: "1mb"}), MWSearch.post);
        this.mainApp.get("/history", MWHistory.get);
        /*
        this.mainApp.get("/edit", MiddlewareEdit.get);
        mainApp.get("/edit/previewHtml", MiddlewareEdit.getPreviewHtml);
        mainApp.post("/edit", bodyParser.json({extended: false, limit: "1mb"}), MiddlewareEdit.post);
        //mainApp.get("/upload", MiddlewareUpload.get);
        mainApp.post("/upload", bodyParser.urlencoded({extended: false, limit: "2mb"}), MiddlewareUpload.post);
        mainApp.get("/manage", MiddlewareManage.get);
        mainApp.get("/gallery", MiddlewareView.getGallery);
        mainApp.get("/history", MiddlewareView.getHistory);
         */
        this.mainApp.use(cookieParser('singedMyCookie'));
        this.mainApp.get("/view", MWView.get);
        this.mainApp.use(session({
            secret: 'sig#^#$SFWGE++|@^!>>>.aap',
            name: 'session_id',
            resave: true,
            saveUninitialized: true,
            cookie: {
                maxAge: 1000 * 30 * 60    /*30min*/
            },
            rolling: true,//在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
        }))
        this.mainApp.get("/edit", MWEdit.get);
        this.mainApp.post("/edit", bodyParser.json({extended: false, limit: "1mb"}), MWEdit.post);
        this.mainApp.get("/login", MWLogin.get);
        this.mainApp.post("/login", bodyParser.json({extended: false, limit: "1kb"}), MWLogin.post);

        this.mainApp.listen(port, () => Log.Info(`HTTP server is now listening port: ${port}`));
    }
}

const htmlServer = new HTMLServer(8081);
