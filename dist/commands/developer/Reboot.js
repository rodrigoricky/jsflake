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
const Logger_1 = __importDefault(require("../../classes/Logger"));
const Command_1 = __importDefault(require("../../structures/Command"));
class RebootCommand extends Command_1.default {
    constructor(client) {
        super(client, {
            name: 'reboot',
            group: 'Developer',
            description: 'Reboots the bot.',
            require: {
                developer: true
            }
        });
    }
    run(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.log('WARNING', `Bot rebooting... (Requested by ${message.author.tag})`, true);
            this.client.destroy();
            this.client.registry.reregisterAll();
            this.client.login(this.client.config.token).then(() => __awaiter(this, void 0, void 0, function* () {
                this.client.emit('ready');
                yield message.channel.send({
                    embeds: [
                        {
                            color: 'GREEN',
                            description: `${message.author}, bot rebooted successfully.`
                        }
                    ]
                });
            }));
        });
    }
}
exports.default = RebootCommand;
