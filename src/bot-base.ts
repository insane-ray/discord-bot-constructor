import { BotAction, BotConfig, BotState } from "./config.interface";
import { Client, Message } from "discord.js";

export abstract class BotBase {
  protected constructor(
    protected readonly client: Client,
    protected readonly token: string,
    protected readonly prefix: string,
    protected readonly config: BotConfig,
  ) {
    this.observeSocket();
  }

  protected abstract onMessage(message: Message): void;

  private readonly _i18n: {[key: string]: string} = {
    actionNotFound: "Action not found",
    argumentNotFound: "Action not found",
    wrongMention: "No user mentioned",
    wrongArgument: "Invalid argument",
    helpInfoList: "'/help list' - to see all actions",
    helpInfoAction: "'/help action' - to get help about specific action",
    helpList: "List of available actions:"
  };

  private observeSocket(): void {
    this.observeReady();
    this.observeMessage();
    this.loginBot();
  }

  private observeReady(): void {
    this.client.on('ready', () => {
      console.log(`${this.client.user?.tag} has logged in.`);
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
      console.log(`${this.client.user?.tag} presence has been updated.`);
    }
  }

  private observeMessage(): void {
    this.client.on('message', async (message) => {
      this.onMessage(message)
    });
  }

  private loginBot(): void {
    this.client.login(this.token);
  }

  protected getAction(name: string): BotAction | null {
    return this.config.actions.find(action => action.name === name) || null
  }

  protected get botState(): BotState | null {
    return this.config.botState || null;
  }

  protected i18n(phrase: string): string | null {
    const i18n = this.config.i18n;
    return i18n ? i18n[phrase] || this._i18n[phrase] : this._i18n[phrase];
  }
}
