"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const EnvError_1 = __importDefault(require("../errors/EnvError"));
class EnvLoader {
    static load() {
        dotenv_1.default.config();
        this.validate(process.env);
    }
    static validate(env) {
        if (env.TOKEN === '')
            throw new EnvError_1.default('Discord token missing.');
        if (env.PREFIX === '')
            throw new EnvError_1.default('Prefix missing.');
        if (env.DEVELOPERS === '')
            throw new EnvError_1.default('Developers missing.');
        if (!env.DEVELOPERS.startsWith('[') || !env.DEVELOPERS.endsWith(']'))
            throw new EnvError_1.default('Developers must be an array.');
        try {
            JSON.parse(env.DEVELOPERS);
        }
        catch (_) {
            throw new EnvError_1.default('Developers must be an array.');
        }
        if (env.UNKNOWN_COMMAND_ERROR === '')
            throw new EnvError_1.default('Unknown command error missing');
        if (!['true', 'false'].includes(env.UNKNOWN_COMMAND_ERROR))
            throw new EnvError_1.default('Unknown command error must be typeof boolean.');
    }
}
exports.default = EnvLoader;
