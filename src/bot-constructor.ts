import { Client, GuildMember, Message } from 'discord.js';
import { BotBase } from "./bot-base";
import { BotUtil } from "./bot-util";
import { BotAction, BotConfig, IterableData } from "./config.interface";

export enum ActionType {
  simple = 'simple',
  mention = 'mention',
  text = 'text',
  nested = 'nested',
  custom = 'custom'
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
      config.prefix,
      config.token,
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

  protected getPhrase(
    message: Message,
    action: BotAction,
    info?: IterableData<string>
  ): string {
    const author: GuildMember = BotUtil.getMsgAuthor(message);
    const phrases: string[] = action.phrases as string[];
    const randomIndex: number = (phrases.length > 0) ? BotUtil.randomNumber(0, phrases.length) : 0;

    return this.parsePhraseTemplate(phrases[randomIndex], {
      ...info,
      author: author.nickname || author.user.username,
    });
  }

  protected parsePhraseTemplate(phrase: string, info: IterableData<string>): string {
    phrase = phrase.replace("{author}", info.author || '');
    phrase = phrase.replace("{mentionedUser}", info.mentionedUser || '');

    return phrase;
  }

  private runAction(message: Message): void {
    const actionsParams: ActionParam = this.getActionParams(message);
    const action: BotAction | null = this.getAction(actionsParams.name);
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

  private runSimpleAction(message: Message, action: BotAction): void {
    message.channel.send(this.getPhrase(message, action));
  };

  private runTextAction(message: Message, action: BotAction, args: string[]): void {
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

    message.channel.send(this.getPhrase(message, nestedAction));
  };

  private runMentionAction(message: Message, action: BotAction): void {
    const member = BotUtil.getMentionedMember(message);

    if (!member) {
      message.reply(this.i18n('wrongMention'));
      return;
    }

    message.channel.send(
      this.getPhrase(message, action, {
        mentionedUser: member.nickname || member.user.username
      })
    );
  };

  private runCustomAction(message: Message, action: BotAction, args: string[]): void {
    action.apply(message, action, args)
  };
}
