const URL = require("url");
const QUERYSTRING = require("querystring");

var EraseValueFromArray = function (arr, value) {
  const N = arr.length;
  let i = 0;
  for (; i < N; ++i) {
    if (arr[i] == value) break;
  }
  arr.splice(i, 1);
};

var BindFunction = function (fn, defaultValue) {
  return function (param) {
    return fn(param, defaultValue);
  };
}

var BindFunction_reserve2 = function (fn, defaultValue) {
  return function (p1, p2) {
    return fn(p1, p2, defaultValue);
  };
};

var GetQueryValue = function (req, key) {
  const url = URL.parse(req.url);
  if (url.query) {
    const query = QUERYSTRING.parse(url.query);
    return query[key] || null;
  } else {
    return null;
  }
};

var GetQueryValueOfCMD = function (req) {
  return GetQueryValue(req,"cmd");
}

var GetQueryValueOfFileName = function (req) {
  return GetQueryValue(req,"n");
}

var GetQueryValueOfCategory = function (req) {
  return GetQueryValue(req,"c");
}

var MakeArticleURL = function (fileName) {
  let _obj = {
    "n": fileName,
  };
  let _query = "/view?" + QUERYSTRING.stringify(_obj);
  return _query;
};

var MakeHomeURL = function (obj) {
  let _query = "/";
  return _query;
};

var CheckLogin = function (req) {
  return (req.signedCookies.account) ? true : false;
};

var SetCookie = function (req, key, value) {
  req.signedCookies[key] = value;
};

var GetCookie = function (req, key) {
  return req.signedCookies[key];
};

var SetValueIfNull = function (target, defaultValue) {
  target = target || defaultValue;
};

var DeleteFromArray = function (array, value) {
  let idx = array.indexOf(value);
  if (idx >= 0) array.splice(idx, 1);
};

module.exports.GetCookie = GetCookie;
module.exports.SetCookie = SetCookie;
module.exports.EraseValueFromArray = EraseValueFromArray;
module.exports.CheckLogin = CheckLogin;
module.exports.GetQueryValue = GetQueryValue;
module.exports.GetQueryValueOfCMD = GetQueryValueOfCMD;
module.exports.GetQueryValueOfFileName = GetQueryValueOfFileName;
module.exports.GetQueryValueOfCategory = GetQueryValueOfCategory;
module.exports.BindFunction = BindFunction;
module.exports.BindFunction_reserve2 = BindFunction_reserve2;
module.exports.SetValueIfNull = SetValueIfNull;
module.exports.DeleteFromArray = DeleteFromArray;
module.exports.MakeArticleURL = MakeArticleURL;
module.exports.MakeHomeURL = MakeHomeURL;