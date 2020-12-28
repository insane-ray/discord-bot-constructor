import { Client, GuildMember, Message } from 'discord.js';
import { BotBase } from "./bot-base";
import { BotUtil } from "./bot-util";
import { BotAction, BotConfig } from "./config.interface";

export enum ActionType {
  simple = 'simple',
  mention = 'mention',
  text = 'text',
  nested = 'nested'
}

export interface ConstructorConfig {
  token: string,
  prefix: string,
  config: BotConfig,
}

export interface ActionParam {
  name: string;
  args: string[];
}

export class BotConstructor extends BotBase {
  constructor(config: ConstructorConfig) {
    super(
      new Client({
        partials: ['MESSAGE']
      }),
      config.token,
      config.prefix,
      config.config
    );
  }

  protected isCommand(message: Message): boolean {
    return message.content.startsWith(this.prefix)
  };

  protected onMessage(message: Message): void {
    if (this.isCommand(message)) {
      this.runAction(message);
    }
  }

  protected getActionParams(message: Message): ActionParam {
    const [name, ...args] = message.content
      .trim()
      .substring(this.prefix.length)
      .split(/\s+/);

    return { name: name, args: args }
  };

  private runAction(message: Message): void {
    const actionsParams: ActionParam = this.getActionParams(message);
    const action: BotAction | null = this.getAction(actionsParams.name);
    if (!action) {
      message.reply(this.i18n('actionNotFound'));
      return;
    }

    switch (action.type) {
      case ActionType.simple:
        return this.runSimpleAction(action, message);
    }
  }

  private runSimpleAction(action: BotAction, message: Message): void {
    message.channel.send(this.getPhrase(action, message));
  };

  protected getPhrase(
    action: BotAction,
    message: Message,
    info?: {[key: string]: string}
  ): string {
    const author: GuildMember = this.getMsgAuthor(message) as GuildMember;
    const phrases: string[] = action.phrases as string[];
    const randomIndex: number = (phrases.length > 0) ? BotUtil.randomNumber(0, phrases.length) : 0;

    return this.parsePhraseTemplate(phrases[randomIndex], {
      ...info,
      author: author.nickname || author.user.username,
    });
  }

  protected parsePhraseTemplate(phrase: string, info: {[key: string]: string}): string {
    phrase = phrase.replace("{author}", info.author || '');
    phrase = phrase.replace("{mentionedUser}", info.mentionedUser || '');

    return phrase;
  }

  protected getMsgAuthor(message: Message): GuildMember | undefined {
    return message.guild?.members.cache.get(message.author.id)
  };
}
