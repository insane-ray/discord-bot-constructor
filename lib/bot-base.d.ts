import { Client, Message } from "discord.js";
import { BotAction, BotConfig, BotState, ParsedSlug, PhraseSlug } from "./config.interface";
export declare abstract class BotBase {
    protected readonly client: Client;
    protected readonly prefix: string;
    private readonly token;
    private config;
    protected constructor(client: Client, prefix: string, token: string, config: BotConfig);
    protected abstract onMessage(message: Message): void;
    protected onActionInit(): void;
    protected onSlugInit(): void;
    private phraseSlugs;
    private systemActions;
    private systemSlugs;
    protected customActions: BotAction[];
    protected customSlugs: PhraseSlug[];
    private readonly _i18n;
    private extendActions;
    private extendSlugs;
    private initSystemActions;
    private initSystemSlugs;
    private observeSocket;
    private observeReady;
    private setBotPresence;
    private observeMessage;
    private loginBot;
    protected get actionList(): BotAction[];
    protected getAction(name: string): BotAction | null;
    protected getNestedAction(action: BotAction, name: string): BotAction | undefined;
    protected get botState(): BotState | null;
    protected i18n(phrase: string): string;
    protected get slugList(): PhraseSlug[];
    protected parseSlug(name: string, message: Message, action: BotAction): Promise<ParsedSlug>;
}
//# sourceMappingURL=bot-base.d.ts.map