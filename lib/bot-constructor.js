"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotConstructor = exports.ActionType = void 0;
const discord_js_1 = require("discord.js");
const bot_base_1 = require("./bot-base");
const bot_util_1 = require("./bot-util");
var ActionType;
(function (ActionType) {
    ActionType["simple"] = "simple";
    ActionType["mention"] = "mention";
    ActionType["text"] = "text";
    ActionType["nested"] = "nested";
    ActionType["custom"] = "custom";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
class BotConstructor extends bot_base_1.BotBase {
    constructor(config) {
        super(new discord_js_1.Client({
            partials: ['MESSAGE'],
        }), config.prefix, config.token, config.config);
    }
    isCommand(message) {
        return message.content.startsWith(this.prefix);
    }
    ;
    onMessage(message) {
        if (this.isCommand(message)) {
            this.runAction(message);
        }
    }
    getActionParams(message) {
        const [name, ...args] = message.content
            .trim()
            .substring(this.prefix.length)
            .split(/\s+/);
        return { name: name, args: args };
    }
    ;
    runAction(message) {
        const actionsParams = this.getActionParams(message);
        const action = this.getAction(actionsParams.name);
        if (!action) {
            message.reply(this.i18n('actionNotFound'));
            return;
        }
        switch (action.type) {
            case ActionType.simple:
                return this.runSimpleAction(message, action);
            case ActionType.text:
                return this.runTextAction(message, action, actionsParams.args);
            case ActionType.mention:
                return this.runMentionAction(message, action);
            case ActionType.custom:
                return this.runCustomAction(message, action, actionsParams.args);
        }
    }
    getPhrase(message, action) {
        const phrases = action.phrases;
        const randomIndex = (phrases.length > 0) ? bot_util_1.BotUtil.randomNumber(0, phrases.length) : 0;
        const randomPhrase = phrases[randomIndex];
        return this.parsePhraseTemplate(message, action, randomPhrase);
    }
    parsePhraseTemplate(message, action, phrase) {
        const slugList = this.slugList.map(slug => slug.name);
        return new Promise((resolve, reject) => {
            const promises = [];
            slugList.forEach(slugName => {
                const slug = `{${slugName}}`;
                if (phrase.includes(slug)) {
                    promises.push(this.parseSlug(slugName, message, action));
                }
            });
            Promise.all(promises).then((value) => {
                value.forEach(parsedSlug => {
                    phrase = phrase.replace(new RegExp(`{${parsedSlug.name}}`, "g"), parsedSlug.parsedValue);
                });
            }).then(() => {
                resolve(phrase);
            });
        });
    }
    runSimpleAction(message, action) {
        this.getPhrase(message, action)
            .then(msg => {
            message.channel.send(msg);
        });
    }
    ;
    runTextAction(message, action, args) {
        if (args.length === 0) {
            message.reply(this.i18n('wrongArgument'));
            return;
        }
        const actionText = args.join(' ');
        const nestedAction = this.getNestedAction(action, actionText);
        if (!nestedAction) {
            message.reply(this.i18n('actionNotFound'));
            return;
        }
        this.getPhrase(message, nestedAction)
            .then(msg => {
            message.channel.send(msg);
        });
    }
    ;
    runMentionAction(message, action) {
        const member = bot_util_1.BotUtil.getMentionedMember(message);
        if (!member) {
            message.reply(this.i18n('wrongMention'));
            return;
        }
        this.getPhrase(message, action)
            .then(msg => {
            message.channel.send(msg);
        });
    }
    ;
    runCustomAction(message, action, args) {
        action.apply(message, action, args);
    }
    ;
}
exports.BotConstructor = BotConstructor;
//# sourceMappingURL=bot-constructor.js.map