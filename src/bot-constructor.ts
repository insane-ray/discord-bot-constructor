import { Client, Message } from 'discord.js';
import { BotBase } from "./bot-base";
import { BotUtil } from "./bot-util";
import { BotAction, BotConfig, ParsedSlug } from "./config.interface";

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

export class BotConstructor extends BotBase  {
  constructor(config: ConstructorConfig) {
    super(
      new Client({
        partials: ['MESSAGE'],
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

  protected getPhrase(
    message: Message,
    action: BotAction,
  ): Promise<string> {
    const phrases: string[] = action.phrases as string[];
    const randomIndex: number = (phrases.length > 0) ? BotUtil.randomNumber(0, phrases.length) : 0;
    const randomPhrase = phrases[randomIndex];

    return this.parsePhraseTemplate(message, action, randomPhrase);
  }

  protected parsePhraseTemplate(message: Message, action: BotAction, phrase: string): Promise<string> {
    const slugList: string[] = this.slugList.map(slug => slug.name);
    return new Promise<string>((resolve, reject) => {
      const promises: Promise<ParsedSlug>[] = [];
      slugList.forEach(slugName => {
        const slug = `{${slugName}}`;
        if (phrase.includes(slug)) {
          promises.push(this.parseSlug(slugName, message, action));
        }
      });

      Promise.all(promises).then((value: ParsedSlug[]) => {
        value.forEach(parsedSlug => {
          phrase = phrase.replace(new RegExp(`{${parsedSlug.name}}`, "g"), parsedSlug.parsedValue as string);
        });
      }).then(() => {
        resolve(phrase);
      });
    });
  }

  private runSimpleAction(message: Message, action: BotAction): void {
    this.getPhrase(message, action)
      .then(msg => {
        message.channel.send(msg)
      });
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

    this.getPhrase(message, nestedAction)
      .then(msg => {
        message.channel.send(msg);
      });
  };

  private runMentionAction(message: Message, action: BotAction): void {
    const member = BotUtil.getMentionedMember(message);

    if (!member) {
      message.reply(this.i18n('wrongMention'));
      return;
    }

    this.getPhrase(message, action)
      .then(msg => {
        message.channel.send(msg);
      });
  };

  private runCustomAction(message: Message, action: BotAction, args: string[]): void {
    action.apply(message, action, args)
  };
}
