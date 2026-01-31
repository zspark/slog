const {Group, Result, DataType, GlobalPaths} = require("./basic");
const Utils = require("./utils");
const {v4: uuidv4} = require('uuid');

const s_heartBeatInternal = 20000;
let s_connectionCheck = null;
let mapSession = new Group("sessions");

class ClientSession {
    constructor() {
        Utils.CreateProperty(this, "id", uuidv4(), false, false, false);
        this.sessionStartTime = Date.now();
        this.lastHeartBeatTime = this.sessionStartTime;
    }

    UpdateHeartBeatTime() {
        this.lastHeartBeatTime = Date.now();
    }
}

let _StartHearBeatCheck = function () {
    if (s_connectionCheck) return;

    let _removeArray = [];
    s_connectionCheck = setInterval(() => {
        mapSession.ForEachItem((s, sid) => {
            const _delta = Date.now() - s.lastHeartBeatTime;
            if (_delta > s_heartBeatInternal) {
                _removeArray.push(sid);
            }
        });

        if (_removeArray.length > 0) {
            _removeArray.forEach((sid) => {
                mapSession.RemoveItem(sid);
            });
            _removeArray.length = 0;
        }

        if (mapSession.GetItemCount() <= 0) {
            if (s_connectionCheck != null) {
                clearInterval(s_connectionCheck);
                s_connectionCheck = null;
            }
        }
    }, s_heartBeatInternal);
    return true;
}

let CreateSession = function () {
    let _tmp = new ClientSession();
    mapSession.AddItem(_tmp.id, _tmp);
    return _tmp;
}

let DestroySession = function (sid) {
    return mapSession.RemoveItem(sid);
}

let GetSession = function (sid) {
    return mapSession.GetItem(sid);
}

let IsDataLocked = function (id, dataType) {
    switch (dataType) {
        case DataType.ARTICLE:
            break;
        case DataType.TAG:
            break;
        case DataType.NOTEBOOK:
            break;
        default:
            break;
    }
}


module.exports.IsDataLocked = function (id, dataType) {
}

/**
 * return sid;
 */
module.exports.CreateSession = function () {
    let _tmp = CreateSession();
    _StartHearBeatCheck();
    return _tmp.id;
}
module.exports.DestorySession = function (sid) {
    if (DestroySession(sid)) {
        return Result.OK;
    } else {
        return Result.SESSION_NOT_EXIST;
    }
}
module.exports.HeartBeat = function (sid) {
    let _tmp = GetSession(sid);
    if (_tmp) {
        _tmp.UpdateHeartBeatTime();
        return Result.OK;
    } else {
        return Result.SESSION_NOT_EXIST;
    }
}
