"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DiscordClient_1 = __importDefault(require("./structures/DiscordClient"));
const client = new DiscordClient_1.default(['GUILDS', 'GUILD_MESSAGES']);
exports.default = client;
