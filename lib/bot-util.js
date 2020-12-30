"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotUtil = void 0;
class BotUtil {
    static randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    ;
    static getMsgAuthor(message) {
        var _a;
        return (_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(message.author.id);
    }
    ;
    static getMentionedMember(message) {
        var _a, _b;
        return (_b = (_a = message.mentions) === null || _a === void 0 ? void 0 : _a.members) === null || _b === void 0 ? void 0 : _b.first();
    }
    static getMemberName(member) {
        return member.nickname || member.user.username;
    }
    static get currentTime() {
        const date = new Date();
        return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear().toString().padStart(4, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    }
}
exports.BotUtil = BotUtil;
//# sourceMappingURL=bot-util.js.map