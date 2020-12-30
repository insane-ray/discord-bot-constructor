import { GuildMember, Message } from "discord.js";
export declare class BotUtil {
    static randomNumber(min: number, max: number): number;
    static getMsgAuthor(message: Message): GuildMember;
    static getMentionedMember(message: Message): GuildMember | undefined;
    static getMemberName(member: GuildMember): string;
    static get currentTime(): string;
}
//# sourceMappingURL=bot-util.d.ts.map