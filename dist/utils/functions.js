"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSeconds = exports.isUserDeveloper = exports.isConstructor = void 0;
require("moment-duration-format");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const isConstructorProxyHandler = {
    construct() {
        return Object.prototype;
    }
};
function isConstructor(func, _class) {
    try {
        new new Proxy(func, isConstructorProxyHandler)();
        if (!_class)
            return true;
        return func.prototype instanceof _class;
    }
    catch (err) {
        return false;
    }
}
exports.isConstructor = isConstructor;
function isUserDeveloper(client, userId) {
    return client.config.developers.includes(userId);
}
exports.isUserDeveloper = isUserDeveloper;
function formatSeconds(seconds, format = 'Y [year] M [month] W [week] D [day] H [hour] m [minute] s [second]') {
    const str = moment_timezone_1.default.duration(seconds, 'seconds').format(format);
    const arr = str.split(' ');
    var newStr = '';
    arr.forEach((value, index) => {
        if (isNaN(parseInt(value)))
            return;
        const val = parseInt(value);
        if (val === 0)
            return;
        else {
            const nextIndex = arr[index + 1];
            newStr += `${value} ${nextIndex} `;
        }
    });
    return newStr.trim();
}
exports.formatSeconds = formatSeconds;
