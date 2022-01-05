"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EnvLoader_1 = __importDefault(require("./classes/EnvLoader"));
EnvLoader_1.default.load();
const moment_timezone_1 = __importDefault(require("moment-timezone"));
moment_timezone_1.default.locale('en');
moment_timezone_1.default.tz.setDefault('Asia/Tokyo');
const client_1 = __importDefault(require("./client"));
client_1.default.login(client_1.default.config.token);
