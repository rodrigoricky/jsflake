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
const Event_1 = __importDefault(require("../structures/Event"));
class ReadyEvent extends Event_1.default {
    constructor(client) {
        super(client, 'ready');
    }
    run() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.log('SUCCESS', `Logged in as "${(_a = this.client.user) === null || _a === void 0 ? void 0 : _a.tag}".`);
        });
    }
}
exports.default = ReadyEvent;
