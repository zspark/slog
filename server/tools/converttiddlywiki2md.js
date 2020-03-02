const FS = require('fs');

const pathes = require("../js/pathes");
const FileFolderHandler = require(pathes.pathJS + 'file_folder_handler');
var bQuote = false;
var ConvertLine = function (line) {
  const L = line.length;
  var g = true;
  var out = "";
  for (let i = 0; i < L; ++i) {
    if (out.length <= 0) {
      if (line[i] == " ") continue;
    }

    /// quote
    if (line[i] == "<") {
      if (i + 1 < L) {
        if (line[i + 1] == "<") {
          if (i + 2 < L) {
            if (line[i + 2] == "<") {
              bQuote = !bQuote;
              i+=2;
              out += ">";
              continue;
            }
          }
        }
      }
    }
    if(bQuote){
      if (out.length <= 0) out += ">";
    }

    if (g) {
      if (line[i] == '!') {
        out += '#';
        continue;
      } else {
        if (out.length > 0) {
          out += ' ';
        }
        g = false;
      }
    }
    if (line[i] == "'") {
      if (i + 1 < L) {
        if (line[i + 1] == "'") {
          out += '**';
          ++i;
          continue;
        }
      }
    }

    out += line[i];
  }
  return out + "\r\n";
};

var Convert = function (c) {
  let newArray = [];
  let ListArry = c.split("\r\n");
  ListArry.forEach((line) => {
    newArray.push(ConvertLine(line));
  });

  let out = "";
  newArray.forEach((line) => {
    out += line;
  });
  return out;
}

var Start = function (path) {
  let arr = FileFolderHandler.ReadAllFileNamesInFolder(path);
  const N = arr.length;
  for (let i = 0; i < N; ++i) {
    let url = path + arr[i];
    let content = FileFolderHandler.ReadFileUTF8(url);
    let out = Convert(content);
    let fileName = arr[i].substr(0, arr[i].length - 4);
    FileFolderHandler.WriteFileUTF8(path + "out/" + fileName + ".md", out);
  }
}

//Start("C:\\msys64\\home\\jerry\\tiddlywiki\\tiddlers\\posts\\projects\\");
//Start("C:\\msys64\\home\\jerry\\tiddlywiki\\tiddlers\\posts\\computer_graphics\\interactive_computer_graphics\\");
//Start("C:\\msys64\\home\\jerry\\tiddlywiki\\tiddlers\\posts\\linux\\");
//Start("C:\\msys64\\home\\jerry\\tiddlywiki\\tiddlers\\posts\\philosophy_and_thoughts\\");
Start("C:\\msys64\\home\\jerry\\tiddlywiki\\tiddlers\\posts\\");