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
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../../structures/Command"));
const functions_1 = require("../../utils/functions");
class HelpCommand extends Command_1.default {
    constructor(client) {
        super(client, {
            name: 'help',
            group: 'General',
            description: 'Shows information about commands and groups.',
            cooldown: 30
        });
    }
    getAvailableGroups(message) {
        const registry = this.client.registry;
        const groupKeys = registry.getAllGroupNames();
        const groups = [];
        groupKeys.forEach(group => {
            const commandsInGroup = registry.findCommandsInGroup(group);
            const commands = [];
            commandsInGroup.forEach(commandName => {
                const command = registry.findCommand(commandName);
                if (!command.isUsable(message))
                    return;
                commands.push(commandName);
            });
            if (commands.length)
                groups.push({ name: group, commands });
        });
        return groups;
    }
    sendHelpMessage(message, groups) {
        return __awaiter(this, void 0, void 0, function* () {
            const embed = new discord_js_1.MessageEmbed({
                color: 'BLUE',
                title: 'Help',
                footer: {
                    text: `Type "${this.client.config.prefix}help [command-name]" for more information.`
                }
            });
            groups.forEach(group => embed.addField(`${group.name} Commands`, group.commands.map(x => `\`${x}\``).join(' ')));
            yield message.channel.send({ embeds: [embed] });
        });
    }
    run(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const groups = this.getAvailableGroups(message);
            if (!args[0])
                return yield this.sendHelpMessage(message, groups);
            const command = this.client.registry.findCommand(args[0].toLocaleLowerCase());
            if (!command)
                return yield this.sendHelpMessage(message, groups);
            var isAvailable = false;
            groups.forEach(group => {
                if (group.commands.includes(command.info.name))
                    isAvailable = true;
            });
            if (!isAvailable)
                return yield this.sendHelpMessage(message, groups);
            const embed = new discord_js_1.MessageEmbed({
                color: 'BLUE',
                title: 'Help',
                fields: [
                    {
                        name: 'Name',
                        value: command.info.name
                    },
                    {
                        name: 'Group',
                        value: command.info.group
                    },
                    {
                        name: 'Cooldown',
                        value: command.info.cooldown ? functions_1.formatSeconds(command.info.cooldown) : 'No cooldown'
                    },
                    {
                        name: 'Usable At',
                        value: command.info.onlyNsfw ? 'NSFW channels' : 'All text channels'
                    },
                    {
                        name: 'Aliases',
                        value: command.info.aliases ? command.info.aliases.map(x => `\`${x}\``).join(' ') : 'No aliases'
                    },
                    {
                        name: 'Example Usages',
                        value: command.info.examples ? command.info.examples.map(x => `\`${x}\``).join('\n') : 'No examples'
                    },
                    {
                        name: 'Description',
                        value: command.info.description ? command.info.description : 'No description'
                    }
                ]
            });
            if (command.info.require) {
                if (command.info.require.developer)
                    embed.setFooter('This is a developer command.');
                if (command.info.require.permissions)
                    embed.addField('Permission Requirements', command.info.require.permissions.map(x => `\`${x}\``).join('\n'));
            }
            yield message.channel.send({ embeds: [embed] });
        });
    }
}
exports.default = HelpCommand;
