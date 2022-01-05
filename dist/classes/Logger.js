"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class Logger {
    static log(type, message, spaces = false, format = 'DD/MM/YYYY HH:mm:ss') {
        var color;
        switch (type) {
            case 'SUCCESS':
                color = 'green';
                break;
            case 'WARNING':
                color = 'yellow';
                break;
            case 'ERROR':
                color = 'red';
                break;
            case 'INFO':
                color = 'blue';
                break;
        }
        console.log(`${spaces ? '\n' : ''}${chalk_1.default.magenta(`${moment_timezone_1.default().format(format)}`)} ${chalk_1.default[color].bold(`${type}`)} ${message}${spaces ? '\n' : ''}`);
    }
}
exports.default = Logger;
