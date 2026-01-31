const QUERYSTRING = require("querystring");

let EraseValueFromArray = function (arr, value) {
    let _i = arr.indexOf(value);
    if (_i >= 0) {
        arr.splice(_i, 1);
    }
};

let BindFunction = function (fn, defaultValue) {
    return function (param) {
        return fn(param, defaultValue);
    };
}

let BindFunction_reserve2 = function (fn, defaultValue) {
    return function (p1, p2) {
        return fn(p1, p2, defaultValue);
    };
};

let CheckFileNameLegality = function (fileName) {
    let _arr = fileName.match(/^\w[\w\.-]*\w$/g);
    if (_arr == null) return false;
    return _arr[0] == fileName;
};

let GetQueryValues = function (req, out) {
    let _obj = Object.create(null);
    const url = new URL(req.url);
    if (url.query) {
        const _q = QUERYSTRING.parse(url.query);
        _obj.fileName = _q['n'];
        _obj.command = _q['cmd'];
        _obj.category = _q['c'];
        _obj.module = _q['m'];
        _obj.action = _q['a'];
    }
};

let GetQueryValue = function (req, key) {
    const url = URL.parse(req.url);
    if (url.query) {
        const query = QUERYSTRING.parse(url.query);
        return query[key] || null;
    } else {
        return null;
    }
};

let MakeLoginURL = function () {
    let _query = "/login";
    return _query;
};

let MakeArticleURL = function (fileName) {
    let _obj = {
        "n": fileName,
    };
    let _query = "/view?" + QUERYSTRING.stringify(_obj);
    return _query;
};

let MakeHomeURL = function () {
    let _query = "/";
    return _query;
};

let MakeEditURL = function (fileName) {
    let _obj = {
        "n": fileName,
    };
    let _query = "/edit?" + QUERYSTRING.stringify(_obj);
    return _query;
};

let MakeViewURL = function (fileName) {
    let _obj = {
        "n": fileName,
    };
    let _query = "/view?" + QUERYSTRING.stringify(_obj);
    return _query;
};

let MakeLoginWithViewURL = function (fileName) {
    let _obj = {
        "n": fileName,
    };
    let _query = "/login?" + QUERYSTRING.stringify(_obj);
    return _query;
};

let CheckLogin = function (req) {
    if (req.signedCookies) {
        return (req.signedCookies.account) ? true : false;
    }
    return false;
};

let GetUserAccount = function (req) {
    if (req.signedCookies) {
        return req.signedCookies.account;
    }
    return null;
};

let SetCookie = function (req, key, value) {
    req.signedCookies[key] = value;
};

let GetClientIP = function (req) {
    return req.connection.remoteAddress;
}

let GetClientPort = function (req) {
    return req.connection.remotePort;
}

let GetCookie = function (req, key) {
    return req.signedCookies[key];
};

let SetValueIfNull = function (target, defaultValue) {
    target = target || defaultValue;
};

let DeleteFromArray = function (array, value) {
    let idx = array.indexOf(value);
    if (idx >= 0) array.splice(idx, 1);
};

let CreateProperty = function (obj, p, v, w, c, e) {
    Object.defineProperty(obj, p, {
        value: v,
        writable: w,
        configurable: c,
        enumerable: e
    });
}

/*
_GetExtension(fileName) {
    let _li = fileName.lastIndexOf(".");
    return fileName.substring(_li + 1);
}
 */

module.exports.GetCookie = GetCookie;
module.exports.SetCookie = SetCookie;
module.exports.EraseValueFromArray = EraseValueFromArray;
module.exports.CheckLogin = CheckLogin;
module.exports.GetUserAccount = GetUserAccount;
module.exports.GetQueryValues = GetQueryValues;
module.exports.CheckFileNameLegality = CheckFileNameLegality;
module.exports.BindFunction = BindFunction;
module.exports.BindFunction_reserve2 = BindFunction_reserve2;
module.exports.SetValueIfNull = SetValueIfNull;
module.exports.DeleteFromArray = DeleteFromArray;
module.exports.MakeArticleURL = MakeArticleURL;
module.exports.MakeHomeURL = MakeHomeURL;
module.exports.MakeEditURL = MakeEditURL;
module.exports.MakeViewURL = MakeViewURL;
module.exports.MakeLoginURL = MakeLoginURL;
module.exports.MakeLoginWithViewURL = MakeLoginWithViewURL;
module.exports.GetClientIP = GetClientIP;
module.exports.GetClientPort = GetClientPort;
module.exports.CreateProperty = CreateProperty;