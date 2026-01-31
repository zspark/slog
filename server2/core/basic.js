const Utils = require("./utils");

const Result = {
    UNKNOW_ERROR: -999999,
    NOT_AUTHORIZED: -100,
    FAIL: -1,
    FILE_NOT_EXIST: -2,
    ARTICLE_NOT_EXIST: -3,
    ACCOUNT_NOT_EXIST: -4,
    SESSION_NOT_EXIST: -5,
    PARSING_ERROR: -7,
    TAG_NOT_EXIST: -30,
    NOTEBOOK_NOT_EXIST: -40,
    SUMMARY_FILE_ERROR: -50,
    USER_FILE_ERROR: -60,
    NOT_PUBLISHED: -100,
    INVALID_ARGUMENT: -1000,
    OK: 1,
    FILE_EXIST: 2,
    ITEM_EXIST: 3,
    LIST_EMPTY: 5,
    VISITOR_ACCOUNT: 100,
}

const DataType = {
    ARTICLE: 10,
    TAG: 10,
    NOTEBOOK: 10,
}

const ErrorCode = {
    UNKNOWN: 10000,
    REQUESTING_FORMAT_ERROR: 10001,
    NO_FILE_NAME: 10002,
    SERVER_SHUT_DOWN: 10003,
    WRONG_ACCOUNT: 10004,
    WRONG_PWD: 10005,
}

const ActionCode = {
    HEART_BEAT: 0,
    SAVE: 1,
    SAVE_AND_EXIT: 2,
    DELETE: 10,
    CANCEL: 20,
    LOGIN: 100,
    UPLOAD: 1000,
    ACTION_CONFIRMED: 5000,
    FILE_EXIST: 5100,
}

const PresentMode = {
    DEFAULT: 0,
    NO_TITLE: 1,
    FULLSCREEN: 10,
}

const HistoryActionType = {
    UNKNOWN: "unknown",
    NEW: "new",
    DELETE: "deleted",
    MODIFIED: "modified",
}

const _ROOT = __dirname + "/../../";
const GlobalPaths = {
    ROOT: _ROOT,
    ROOT_SERVER: _ROOT + "server2/",
    ROOT_CLIENT: _ROOT + "client/",
    ROOT_TEMPLATE: _ROOT + "server2/template/",
    ROOT_CONTENT: _ROOT + "client/content/",
}

class Group {
    constructor(id) {
        Utils.CreateProperty(this, "id", id, false, false, false);
        this.mapItem = new Map();
    }

    GetItem(primaryKey) {
        return this.mapItem.get(primaryKey);
    }

    RemoveItem(primaryKey) {
        return this.mapItem.delete(primaryKey);
    }

    AddItem(primaryKey, item) {
        return this.mapItem.set(primaryKey, item);
    }

    GetItemCount() {
        return this.mapItem.size;
    }

    ForEachItem(fn) {
        this.mapItem.forEach((v, k) => {
            fn(v, k);
        });
    }
}

module.exports = {
    Group: Group,
    Result: Result,
    PresentMode: PresentMode,
    ErrorCode: ErrorCode,
    ActionCode: ActionCode,
    GlobalPaths: GlobalPaths,
    DataType: DataType,
    HistoryActionType: HistoryActionType,
}
