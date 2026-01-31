const CHALK = require('chalk');

const Error = function (info) {
    console.error(CHALK.red(info));
};

const Warn = function (info) {
    console.log(CHALK.blue(info));
};

const Info = function (info) {
    console.info(CHALK.green(info));
};

const Debug = function (info) {
    console.debug(CHALK.white(info));
};

exports.Error = Error;
exports.Warn = Warn;
exports.Info = Info;
exports.Debug = Debug;
