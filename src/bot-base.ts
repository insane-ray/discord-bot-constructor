import { Client, GuildMember, Message } from "discord.js";
import { BotUtil } from "./bot-util";
import { BotAction, BotConfig, BotState, ParsedSlug, PhraseSlug } from "./config.interface";

export abstract class BotBase {
  protected constructor(
    protected readonly client: Client,
    protected readonly prefix: string,
    private readonly token: string,
    private config: BotConfig,
  ) {
    this.extendActions();
    this.extendSlugs();
    this.observeSocket();
  }

  protected abstract onMessage(message: Message): void;

  protected onActionInit(): void {};
  protected onSlugInit(): void {};

  private phraseSlugs: PhraseSlug[] = [];

  private systemActions: BotAction[] = [];
  private systemSlugs: PhraseSlug[] = [];

  protected customActions: BotAction[] = [];
  protected customSlugs: PhraseSlug[] = [];

  private readonly _i18n: {[key: string]: string} = {
    actionNotFound: "action not found",
    argumentNotFound: "action not found",
    wrongMention: "No user mentioned",
    wrongArgument: "Invalid argument",
    helpInfoList: "'/help list' - to see all actions",
    helpInfoAction: "'/help action' - to get help about specific action",
    helpList: "List of available actions:"
  };

  private extendActions(): void {
    this.initSystemActions();
    this.onActionInit();
    this.config.actions = [
      ...this.config.actions,
      ...this.systemActions,
      ...this.customActions
    ]
  }

  private extendSlugs(): void {
    this.initSystemSlugs();
    this.onSlugInit();
    this.phraseSlugs.push(...this.systemSlugs, ...this.customSlugs);
  }

  private initSystemActions(): void {
    this.systemActions.push(
      {
        name: "help",
        type: "custom",
        apply: (message: Message, action: BotAction, args: string[]): void => {
          if (args.length > 0) {
            const command: string = args.join(' ');
            if (command === 'list') {
              const actionList: string = this.actionList
                .filter(action => action.name !== 'help')
                .map(action => action.name).join(', ');
              message.channel.send(`${this.i18n('helpList')} ${actionList}`);
            } else {
              const action: BotAction | null = this.getAction(command);
              if (!action) {
                message.channel.send(this.i18n('actionNotFound'));
                return;
              }
              message.channel.send(action.helpInfo as string);
            }
          } else {
            message.channel.send([
              this.i18n('helpInfoList'),
              this.i18n('helpInfoAction')
            ]);
          }
        }
      }
    )
  }

  private initSystemSlugs(): void {
    this.systemSlugs.push(
      {
        name: 'author',
        apply(message: Message, action: BotAction): Promise<string | number> {
          return new Promise<string|number>((resolve, reject) => {
            resolve(BotUtil.getMemberName(BotUtil.getMsgAuthor(message)));
          });
        }
      },
      {
        name: 'mentionedUser',
        apply(message: Message, action: BotAction): Promise<string | number> {
          return new Promise<string|number>((resolve, reject) => {
            resolve(BotUtil.getMemberName(BotUtil.getMentionedMember(message) as GuildMember));
          });
        }
      },
      {
        name: 'randomMember',
        apply(message: Message, action: BotAction): Promise<string | number> {
          return new Promise<string|number>((resolve, reject) => {
            message.guild?.members
              .fetch({limit: 1000})
              .then(members => {
                const randomMember: GuildMember = members
                  .filter(member => !member.user.bot)
                  .random();
                resolve(BotUtil.getMemberName(randomMember));
              })
              .catch(err => {
                reject(err);
              });
          });
        }
      }
    )
  }

  private observeSocket(): void {
    this.observeReady();
    this.observeMessage();
    this.loginBot();
  }

  private observeReady(): void {
    this.client.on('ready', () => {
      console.log(`${this.client.user?.tag} has logged in. Time: ${BotUtil.currentTime}`);
      this.setBotPresence();
    });
  }

  private setBotPresence(): void {
    const bonState: BotState | null = this.botState;
    if (bonState) {
      this.client.user?.setPresence({
        activity: {
          name: bonState.activity.name,
          type: bonState.activity.type,
          url: bonState.activity.url || undefined,
        },
        status: bonState.status
      });
      console.log(`${this.client.user?.tag} presence has been updated. Time: ${BotUtil.currentTime}`);
    }
  }

  private observeMessage(): void {
    this.client.on('message', async (message) => {
      if(!message.author.bot) {
        this.onMessage(message);
      }
    });
  }

  private loginBot(): void {
    this.client.login(this.token);
  }

  protected get actionList(): BotAction[] {
    return this.config.actions;
  };

  protected getAction(name: string): BotAction | null {
    return this.actionList.find(action => action.name === name) || null
  }

  protected getNestedAction(action: BotAction, name: string): BotAction | undefined {
    return action.children?.find(nested => nested.name === name)
  };

  protected get botState(): BotState | null {
    return this.config.botState || null;
  }

  protected i18n(phrase: string): string {
    const i18n = this.config.i18n;
    return i18n ? i18n[phrase] || this._i18n[phrase] : this._i18n[phrase];
  }

  protected get slugList(): PhraseSlug[] {
    return this.phraseSlugs;
  }

  protected parseSlug(name: string, message: Message, action: BotAction): Promise<ParsedSlug> {
    const phraseSlug = this.slugList.find(slug => slug.name === name) as PhraseSlug;
    return new Promise<ParsedSlug>((resolve, reject) => {
      phraseSlug
        .apply(message, action)
        .then(slug => resolve({ name: name, parsedValue: slug }))
    })
  }
}
