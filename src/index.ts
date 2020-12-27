import { Client, Message } from 'discord.js';
import { Config } from "./config.interface";

interface ConstructorConfig {
  token: string,
  prefix: string,
  config: Config,
}

abstract class BotBase {
  protected constructor(
    protected readonly client: Client,
    protected readonly token: string,
    protected readonly prefix: string,
    protected readonly config: Config,
  ) {
    this.observeSocket();
  }

  protected abstract onMessage(message: Message): void;

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

  // TODO
  private setBotPresence(): void {
    this.client.user?.setPresence({
      activity: {
        name: 'Кемпит на Бубе',
        type: 'PLAYING'
      },
      status: 'online'
    });
    console.log(`${this.client.user?.tag} presence has been updated.`);
  }

  private observeMessage(): void {
    this.client.on('message', async (message) => {
      this.onMessage(message)
    });
  }

  private loginBot(): void {
    this.client.login(this.token);
  }
}

export class BotConstructor extends BotBase {
  constructor(config: ConstructorConfig) {
    super(
      new Client({partials: ['MESSAGE']}),
      config.token,
      config.prefix,
      config.config
    );
  }

  protected onMessage(message: Message): void {
    // TODo
  }
}
