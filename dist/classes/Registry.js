"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const path_1 = __importDefault(require("path"));
const require_all_1 = __importDefault(require("require-all"));
const RegistryError_1 = __importDefault(require("../errors/RegistryError"));
const Command_1 = __importDefault(require("../structures/Command"));
const Event_1 = __importDefault(require("../structures/Event"));
const functions_1 = require("../utils/functions");
const Logger_1 = __importDefault(require("./Logger"));
class Registry {
    constructor(client) {
        this.commandPaths = [];
        this.eventPaths = [];
        this.client = client;
        this.newCollections();
    }
    newCollections() {
        this.commands = new discord_js_1.Collection();
        this.events = new discord_js_1.Collection();
        this.cooldowns = new discord_js_1.Collection();
        this.groups = new discord_js_1.Collection();
    }
    registerEvent(event) {
        if (this.events.some(e => e.name === event.name))
            throw new RegistryError_1.default(`A event with the name "${event.name}" is already registered.`);
        this.events.set(event.name, event);
        this.client.on(event.name, event.run.bind(event));
        Logger_1.default.log('INFO', `Event "${event.name}" loaded.`);
    }
    registerAllEvents() {
        const events = [];
        if (this.eventPaths.length)
            this.eventPaths.forEach(p => {
                delete require.cache[p];
            });
        require_all_1.default({
            dirname: path_1.default.join(__dirname, '../events'),
            recursive: true,
            filter: /\w*.[tj]s/g,
            resolve: x => events.push(x),
            map: (name, filePath) => {
                if (filePath.endsWith('.ts') || filePath.endsWith('.js'))
                    this.eventPaths.push(path_1.default.resolve(filePath));
                return name;
            }
        });
        for (let event of events) {
            const valid = functions_1.isConstructor(event, Event_1.default) || functions_1.isConstructor(event.default, Event_1.default) || event instanceof Event_1.default || event.default instanceof Event_1.default;
            if (!valid)
                continue;
            if (functions_1.isConstructor(event, Event_1.default))
                event = new event(this.client);
            else if (functions_1.isConstructor(event.default, Event_1.default))
                event = new event.default(this.client);
            if (!(event instanceof Event_1.default))
                throw new RegistryError_1.default(`Invalid event object to register: ${event}`);
            this.registerEvent(event);
        }
    }
    registerCommand(command) {
        if (this.commands.some(x => {
            if (x.info.name === command.info.name)
                return true;
            else if (x.info.aliases && x.info.aliases.includes(command.info.name))
                return true;
            else
                return false;
        }))
            throw new RegistryError_1.default(`A command with the name/alias "${command.info.name}" is already registered.`);
        if (command.info.aliases) {
            for (const alias of command.info.aliases) {
                if (this.commands.some(x => {
                    if (x.info.name === alias)
                        return true;
                    else if (x.info.aliases && x.info.aliases.includes(alias))
                        return true;
                    else
                        return false;
                }))
                    throw new RegistryError_1.default(`A command with the name/alias "${alias}" is already registered.`);
            }
        }
        this.commands.set(command.info.name, command);
        if (!this.groups.has(command.info.group))
            this.groups.set(command.info.group, [command.info.name]);
        else {
            const groups = this.groups.get(command.info.group);
            groups.push(command.info.name);
            this.groups.set(command.info.group, groups);
        }
        Logger_1.default.log('INFO', `Command "${command.info.name}" loaded.`);
    }
    registerAllCommands() {
        const commands = [];
        if (this.commandPaths.length)
            this.commandPaths.forEach(p => {
                delete require.cache[p];
            });
        require_all_1.default({
            dirname: path_1.default.join(__dirname, '../commands'),
            recursive: true,
            filter: /\w*.[tj]s/g,
            resolve: x => commands.push(x),
            map: (name, filePath) => {
                if (filePath.endsWith('.ts') || filePath.endsWith('.js'))
                    this.commandPaths.push(path_1.default.resolve(filePath));
                return name;
            }
        });
        for (let command of commands) {
            const valid = functions_1.isConstructor(command, Command_1.default) || functions_1.isConstructor(command.default, Command_1.default) || command instanceof Command_1.default || command.default instanceof Command_1.default;
            if (!valid)
                continue;
            if (functions_1.isConstructor(command, Command_1.default))
                command = new command(this.client);
            else if (functions_1.isConstructor(command.default, Command_1.default))
                command = new command.default(this.client);
            if (!(command instanceof Command_1.default))
                throw new RegistryError_1.default(`Invalid command object to register: ${command}`);
            this.registerCommand(command);
        }
    }
    findCommand(command) {
        return this.commands.get(command) || [...this.commands.values()].find(cmd => cmd.info.aliases && cmd.info.aliases.includes(command));
    }
    findCommandsInGroup(group) {
        return this.groups.get(group);
    }
    getAllGroupNames() {
        return [...this.groups.keys()];
    }
    getCooldownTimestamps(commandName) {
        if (!this.cooldowns.has(commandName))
            this.cooldowns.set(commandName, new discord_js_1.Collection());
        return this.cooldowns.get(commandName);
    }
    registerAll() {
        this.registerAllCommands();
        this.registerAllEvents();
    }
    reregisterAll() {
        const allEvents = [...this.events.keys()];
        allEvents.forEach(event => this.client.removeAllListeners(event));
        this.newCollections();
        this.registerAll();
    }
}
exports.default = Registry;
