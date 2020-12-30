"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotBase = void 0;
const bot_util_1 = require("./bot-util");
class BotBase {
    constructor(client, prefix, token, config) {
        this.client = client;
        this.prefix = prefix;
        this.token = token;
        this.config = config;
        this.phraseSlugs = [];
        this.systemActions = [];
        this.systemSlugs = [];
        this.customActions = [];
        this.customSlugs = [];
        this._i18n = {
            actionNotFound: "action not found",
            argumentNotFound: "action not found",
            wrongMention: "No user mentioned",
            wrongArgument: "Invalid argument",
            helpInfoList: "'/help list' - to see all actions",
            helpInfoAction: "'/help action' - to get help about specific action",
            helpList: "List of available actions:"
        };
        this.extendActions();
        this.extendSlugs();
        this.observeSocket();
    }
    onActionInit() { }
    ;
    onSlugInit() { }
    ;
    extendActions() {
        this.initSystemActions();
        this.onActionInit();
        this.config.actions = [
            ...this.config.actions,
            ...this.systemActions,
            ...this.customActions
        ];
    }
    extendSlugs() {
        this.initSystemSlugs();
        this.onSlugInit();
        this.phraseSlugs.push(...this.systemSlugs, ...this.customSlugs);
    }
    initSystemActions() {
        this.systemActions.push({
            name: "help",
            type: "custom",
            apply: (message, action, args) => {
                if (args.length > 0) {
                    const command = args.join(' ');
                    if (command === 'list') {
                        const actionList = this.actionList
                            .filter(action => action.name !== 'help')
                            .map(action => action.name).join(', ');
                        message.channel.send(`${this.i18n('helpList')} ${actionList}`);
                    }
                    else {
                        const action = this.getAction(command);
                        if (!action) {
                            message.channel.send(this.i18n('actionNotFound'));
                            return;
                        }
                        message.channel.send(action.helpInfo);
                    }
                }
                else {
                    message.channel.send([
                        this.i18n('helpInfoList'),
                        this.i18n('helpInfoAction')
                    ]);
                }
            }
        });
    }
    initSystemSlugs() {
        this.systemSlugs.push({
            name: 'author',
            apply(message, action) {
                return new Promise((resolve, reject) => {
                    resolve(bot_util_1.BotUtil.getMemberName(bot_util_1.BotUtil.getMsgAuthor(message)));
                });
            }
        }, {
            name: 'mentionedUser',
            apply(message, action) {
                return new Promise((resolve, reject) => {
                    resolve(bot_util_1.BotUtil.getMemberName(bot_util_1.BotUtil.getMentionedMember(message)));
                });
            }
        }, {
            name: 'randomNumber',
            apply(message, action) {
                return new Promise((resolve, reject) => {
                    resolve(bot_util_1.BotUtil.randomNumber(1, 101));
                });
            }
        }, {
            name: 'randomMember',
            apply(message, action) {
                return new Promise((resolve, reject) => {
                    var _a;
                    (_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.fetch({ limit: 1000 }).then(members => {
                        const randomMember = members
                            .filter(member => !member.user.bot)
                            .random();
                        resolve(bot_util_1.BotUtil.getMemberName(randomMember));
                    }).catch(err => {
                        reject(err);
                    });
                });
            }
        });
    }
    observeSocket() {
        this.observeReady();
        this.observeMessage();
        this.loginBot();
    }
    observeReady() {
        this.client.on('ready', () => {
            var _a;
            console.log(`${(_a = this.client.user) === null || _a === void 0 ? void 0 : _a.tag} has logged in. Time: ${bot_util_1.BotUtil.currentTime}`);
            this.setBotPresence();
        });
    }
    setBotPresence() {
        var _a, _b;
        const bonState = this.botState;
        if (bonState) {
            (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.setPresence({
                activity: {
                    name: bonState.activity.name,
                    type: bonState.activity.type,
                    url: bonState.activity.url || undefined,
                },
                status: bonState.status
            });
            console.log(`${(_b = this.client.user) === null || _b === void 0 ? void 0 : _b.tag} presence has been updated. Time: ${bot_util_1.BotUtil.currentTime}`);
        }
    }
    observeMessage() {
        this.client.on('message', async (message) => {
            if (!message.author.bot) {
                this.onMessage(message);
            }
        });
    }
    loginBot() {
        this.client.login(this.token);
    }
    get actionList() {
        return this.config.actions;
    }
    ;
    getAction(name) {
        return this.actionList.find(action => action.name === name) || null;
    }
    getNestedAction(action, name) {
        var _a;
        return (_a = action.children) === null || _a === void 0 ? void 0 : _a.find(nested => nested.name === name);
    }
    ;
    get botState() {
        return this.config.botState || null;
    }
    i18n(phrase) {
        const i18n = this.config.i18n;
        return i18n ? i18n[phrase] || this._i18n[phrase] : this._i18n[phrase];
    }
    get slugList() {
        return this.phraseSlugs;
    }
    parseSlug(name, message, action) {
        const phraseSlug = this.slugList.find(slug => slug.name === name);
        return new Promise((resolve, reject) => {
            phraseSlug
                .apply(message, action)
                .then(slug => resolve({ name: name, parsedValue: slug }));
        });
    }
}
exports.BotBase = BotBase;
//# sourceMappingURL=bot-base.js.map