const FS = require("fs");
const MD5 = require("blueimp-md5");

//**************************************************************************************************
const pwd = MD5("1");
//const pwd = MD5("1", { asString: true, encoding: 'binary' });
console.log(pwd);
//end**************************************************************************************************

const targetCSSPath = "./public/css/";
const targetJSPath = "./public/js/";

if(!FS.existsSync(targetCSSPath)){
	FS.mkdirSync(targetCSSPath);
}
if(!FS.existsSync(targetJSPath)){
	FS.mkdirSync(targetJSPath);
}

var filesCSS = [];
//filesCSS.push("./node_modules/bootstrap/dist/css/bootstrap.css");
//filesCSS.push("./css/custom.css");
//filesCSS.push("./css/style.css");

var filesJS = [];
//filesJS.push("./js/editor.js");
//filesJS.push("./node_modules/bootstrap/dist/js/bootstrap.js");
//filesJS.push("./node_modules/jquery/dist/jquery.slim.js");
filesJS.push("./node_modules/marked/marked.min.js");
filesJS.push("./node_modules/blueimp-md5/js/md5.min.js");


var CopyTo = function (from, to) {
	let source = FS.createReadStream(from);
	let target = FS.createWriteStream(to);
	source.pipe(target);
}


var HandleMap = function (files, path) {
	const SIZE = files.length;
	for (var i = 0; i < SIZE; ++i) {
		let from = files[i];
		const k = from.lastIndexOf("/");
		let to = path + from.slice(k + 1);
		CopyTo(from, to);
	}
};

HandleMap(filesCSS, targetCSSPath);
HandleMap(filesJS, targetJSPath);
