const CHALK = require('chalk');

const LOG_ = console.log;
const INFO_ = console.info;
const ERROR_ = console.error;

const RED_ = CHALK.red;
const GREEN_ = CHALK.green;
const BLUE_ = CHALK.blue;
const YELLOW_ = CHALK.yellow;

const Trace = function (fn, color, info, param) {
  const N = param.length;
  if (N === 0) {
    fn(color(info));
  } else if (N === 1) {
    fn(color(info), param[0]);
  } else if (N === 2) {
    fn(color(info), param[0], param[1]);
  } else if (N === 3) {
    fn(color(info), param[0], param[1], param[2]);
  } else if (N === 4) {
    fn(color(info), param[0], param[1], param[2], param[3]);
  }
};

const Error = function (info, ...rest) {
  Trace(ERROR_, RED_, info, rest);
};

const Warn = function (info, ...rest) {
  Trace(LOG_, YELLOW_, info, rest);
};

const Info = function (info, ...rest) {
  Trace(INFO_, GREEN_, info, rest);
};

exports.Error = Error;
exports.Info = Info;
exports.Warn = Warn;