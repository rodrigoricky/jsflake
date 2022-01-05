"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Registry_1 = __importDefault(require("../classes/Registry"));
class DiscordClient extends discord_js_1.Client {
    constructor(intents) {
        super({ intents });
        this.config = {
            token: process.env.TOKEN,
            prefix: process.env.PREFIX,
            developers: JSON.parse(process.env.DEVELOPERS),
            unknownErrorMessage: JSON.parse(process.env.UNKNOWN_COMMAND_ERROR)
        };
        this.registry = new Registry_1.default(this);
        this.registry.registerAll();
    }
}
exports.default = DiscordClient;
