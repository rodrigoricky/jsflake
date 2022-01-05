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
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../utils/functions");
class CommandHandler {
    static handleCommand(client, message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const self = message.guild.me;
            if (!self.permissions.has('SEND_MESSAGES') || !((_a = message.channel.permissionsFor(self)) === null || _a === void 0 ? void 0 : _a.has('SEND_MESSAGES')))
                return;
            if (!self.permissions.has('ADMINISTRATOR'))
                return yield message.channel.send({
                    embeds: [
                        {
                            color: 'RED',
                            title: '🚨 Missing Permission',
                            description: `${message.author}, bot requires \`ADMINISTRATOR\` permission to be run.`
                        }
                    ]
                });
            const prefix = client.config.prefix;
            if (message.content.toLocaleLowerCase().indexOf(prefix) !== 0)
                return;
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();
            const cmd = client.registry.findCommand(command);
            if (!cmd) {
                if (client.config.unknownErrorMessage)
                    yield message.channel.send({
                        embeds: [
                            {
                                color: '#D1D1D1',
                                title: '🔎 Unknown Command',
                                description: `${message.author}, type \`${client.config.prefix}help\` to see the command list.`
                            }
                        ]
                    });
                return;
            }
            if (cmd.info.enabled === false)
                return;
            if (cmd.info.onlyNsfw === true && !message.channel.nsfw && !functions_1.isUserDeveloper(client, message.author.id))
                return yield message.channel.send({
                    embeds: [
                        {
                            color: '#EEB4D5',
                            title: '🔞 Be Careful',
                            description: `${message.author}, you can't use this command on non-nsfw channels.`
                        }
                    ]
                });
            if (cmd.info.require) {
                if (cmd.info.require.developer && !functions_1.isUserDeveloper(client, message.author.id))
                    return;
                if (cmd.info.require.permissions && !functions_1.isUserDeveloper(client, message.author.id)) {
                    const perms = [];
                    cmd.info.require.permissions.forEach(permission => {
                        if (message.member.permissions.has(permission))
                            return;
                        else
                            return perms.push(`\`${permission}\``);
                    });
                    if (perms.length)
                        return yield message.channel.send({
                            embeds: [
                                {
                                    color: '#FCE100',
                                    title: '⚠️ Missing Permissions',
                                    description: `${message.author}, you must have these permissions to run this command.\n\n${perms.join('\n')}`
                                }
                            ]
                        });
                }
            }
            var addCooldown = false;
            const now = Date.now();
            const timestamps = client.registry.getCooldownTimestamps(cmd.info.name);
            const cooldownAmount = cmd.info.cooldown ? cmd.info.cooldown * 1000 : 0;
            if (cmd.info.cooldown) {
                if (timestamps.has(message.author.id)) {
                    const currentTime = timestamps.get(message.author.id);
                    if (!currentTime)
                        return;
                    const expirationTime = currentTime + cooldownAmount;
                    if (now < expirationTime) {
                        yield message.delete();
                        const timeLeft = (expirationTime - now) / 1000;
                        return yield message.channel
                            .send({
                            embeds: [
                                {
                                    color: 'ORANGE',
                                    title: '⏰ Calm Down',
                                    description: `${message.author}, you must wait \`${functions_1.formatSeconds(Math.floor(timeLeft))}\` to run this command.`
                                }
                            ]
                        })
                            .then(msg => setTimeout(() => __awaiter(this, void 0, void 0, function* () { return yield msg.delete().catch(() => { }); }), 3000));
                    }
                }
                addCooldown = true;
            }
            try {
                var applyCooldown = true;
                yield cmd.run(message, args, () => {
                    applyCooldown = false;
                });
                if (addCooldown && applyCooldown && !functions_1.isUserDeveloper(client, message.author.id)) {
                    timestamps.set(message.author.id, now);
                    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
                }
            }
            catch (error) {
                yield cmd.onError(message, error);
            }
        });
    }
}
exports.default = CommandHandler;
