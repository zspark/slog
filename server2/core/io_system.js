const FS = require('fs');

/**
 * if file NOT exist,return null instantly;
 */
var ReadFileUTF8 = function (fileURL, cb = null) {
    if (FileExist(fileURL)) {
        if (cb) {
            FS.readFile(fileURL, "utf8", (err, data) => {
                if (err) {
                    cb(null);
                } else {
                    cb(data);
                }
            });
        } else {
            let file = FS.readFileSync(fileURL, "utf8");
            return file;
        }
    } else {
        return null;
    }
};

var FileExist = function (fileURL) {
    return FS.existsSync(fileURL);
};

var CreateFolder = function (folderPath) {
    return FS.mkdirSync(folderPath, 0744);
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
    if (FileExist(fileURL)) {
        FS.unlinkSync(fileURL);
        return true;
    } else return false;
};

var WriteFileUTF8 = function (fileURL, data, extension = "", cb = null) {
    if (cb) {
        FS.writeFile(fileURL, data, (err) => {
            if (err) {
                cb(false)
            } else {
                cb(true);
            }
        });
    } else {
        FS.writeFileSync(fileURL + extension, data);
    }
    return true;
};

module.exports.ReadFileUTF8 = ReadFileUTF8;
module.exports.WriteFileUTF8 = WriteFileUTF8;
module.exports.FileExist = FileExist;
module.exports.FolderExist = FileExist;
module.exports.CreateFolder = CreateFolder;
module.exports.DeleteFile = DeleteFile;
module.exports.ReadAllFileNamesInFolder = ReadAllFileNamesInFolder;
