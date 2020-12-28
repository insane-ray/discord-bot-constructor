import { BotBase } from "./bot-base";
import { Client, Message } from 'discord.js';
import { BotConfig } from "./config.interface";

interface ConstructorConfig {
  token: string,
  prefix: string,
  config: BotConfig,
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

  protected onMessage(message: Message): void {
    // TODo
  }
}
