const common = require("../core/common");
const constant = common.constant;
var Base = require(common.pathes.pathLayout + "layout_base")
var View = require(common.pathes.pathLayout + "layout_view")
var Search = require(common.pathes.pathLayout + "layout_search")
var Editor = require(common.pathes.pathLayout + "layout_editor")
var History = require(common.pathes.pathLayout + "layout_history")
var Login = require(common.pathes.pathLayout + "layout_login")


/*
module.exports.GenerateHTMLManage = GenerateHTMLManage;
module.exports.GenerateHTMLRebuildSummay = GenerateHTMLRebuildSummay;
module.exports.GenerateHTMLListCategory = GenerateHTMLListCategory;
*/

let layoutBase=new Base();
let layoutView=new View();
var layoutSearch = new Search();
var layoutEditor = new Editor();
var layoutHistory = new History();
var layoutLogin = new Login();
module.exports.GenerateHTMLInfoBoard = (info) => {
    return layoutBase.GenerateInfoBoard(info);
}
module.exports.GenerateHTMLArticle = function (template, fileName, content, title, author, createTime) {
    return layoutView.GenerateArticle(template, fileName, content, title, author, createTime);
}
module.exports.GenerateHTMLArticleList = function (categoryName, arrList) {
    return layoutView.GenerateArticleList(categoryName, arrList);
}
module.exports.GenerateHTMLSearch = function () {
    return layoutSearch.Generate();
}
module.exports.GenerateHTMLSearchContent = function (arrList) {
    return layoutSearch.GenerateSearchContent(arrList);
}
module.exports.GenerateHTMLEdit = function (content, title, author, categoryName, allowHistory, templateOptions) {
    return layoutEditor.Generate(content, title, author, categoryName, allowHistory, templateOptions);
}
module.exports.GenerateHTMLHistory = function (arrList) {
    return layoutHistory.Generate(arrList);
}
module.exports.GenerateHTMLLogin = function (fileName) {
    return layoutLogin.Generate(fileName);
}
module.exports.GenerateHTMLGallery = function(arrList){
    return layoutView.GenerateGallery(arrList);
}