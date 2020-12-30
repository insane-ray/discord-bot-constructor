import { Message } from 'discord.js';
import { BotBase } from "./bot-base";
import { BotAction, BotConfig } from "./config.interface";
export declare enum ActionType {
    simple = "simple",
    mention = "mention",
    text = "text",
    nested = "nested",
    custom = "custom"
}
export interface ConstructorConfig {
    token: string;
    prefix: string;
    config: BotConfig;
}
export interface ActionParam {
    name: string;
    args: string[];
}
export declare class BotConstructor extends BotBase {
    constructor(config: ConstructorConfig);
    protected isCommand(message: Message): boolean;
    protected onMessage(message: Message): void;
    protected getActionParams(message: Message): ActionParam;
    private runAction;
    protected getPhrase(message: Message, action: BotAction): Promise<string>;
    protected parsePhraseTemplate(message: Message, action: BotAction, phrase: string): Promise<string>;
    private runSimpleAction;
    private runTextAction;
    private runMentionAction;
    private runCustomAction;
}
//# sourceMappingURL=bot-constructor.d.ts.map