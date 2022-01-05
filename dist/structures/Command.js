"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../classes/Logger"));
const functions_1 = require("../utils/functions");
class Command {
    constructor(client, info) {
        this.client = client;
        this.info = info;
    }
    onError(message, error) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.log('ERROR', `An error occurred in "${this.info.name}" command.\n${error}\n`, true);
            yield message.channel.send({
                embeds: [
                    {
                        color: 'RED',
                        title: '💥 Oops...',
                        description: `${message.author}, an error occurred while running this command. Please try again later.`
                    }
                ]
            });
        });
    }
    isUsable(message, checkNsfw = false) {
        if (this.info.enabled === false)
            return false;
        if (checkNsfw && this.info.onlyNsfw === true && !message.channel.nsfw && !functions_1.isUserDeveloper(this.client, message.author.id))
            return false;
        if (this.info.require) {
            if (this.info.require.developer && !functions_1.isUserDeveloper(this.client, message.author.id))
                return false;
            if (this.info.require.permissions && !functions_1.isUserDeveloper(this.client, message.author.id)) {
                const perms = [];
                this.info.require.permissions.forEach(permission => {
                    if (message.member.permissions.has(permission))
                        return;
                    else
                        return perms.push(permission);
                });
                if (perms.length)
                    return false;
            }
        }
        return true;
    }
}
exports.default = Command;
