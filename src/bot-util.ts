import { GuildMember, Message } from "discord.js";

export class BotUtil {
  static randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min)
  };

  static getMsgAuthor(message: Message): GuildMember {
    return message.guild?.members.cache.get(message.author.id) as GuildMember
  };

  static getMentionedMember(message: Message): GuildMember | undefined {
    return message.mentions?.members?.first();
  }
}
