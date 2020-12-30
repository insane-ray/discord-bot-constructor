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

  static getMemberName(member: GuildMember): string {
    return member.nickname || member.user.username
  }

  static get currentTime(): string {
    const date: Date = new Date();
    return `${
      (date.getMonth() + 1).toString().padStart(2, '0')}/${
      date.getDate().toString().padStart(2, '0')}/${
      date.getFullYear().toString().padStart(4, '0')} ${
      date.getHours().toString().padStart(2, '0')}:${
      date.getMinutes().toString().padStart(2, '0')}:${
      date.getSeconds().toString().padStart(2, '0')}`
  }
}

