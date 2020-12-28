import { Message } from "discord.js";

export interface IterableData<T> {
  [key: string]: T
}

export interface BotConfig {
  actions: BotAction[];
  botState?: BotState;
  i18n?: IterableData<string>;
}

export interface BotAction {
  name: string;
  type: ActionType;
  helpInfo?: string;
  phrases?: string[];
  children?: BotAction[];
  apply(action: BotAction, message: Message, args: string[]): void;
}

export interface BotState {
  activity: {
    name: string;
    type: BotActivityType;
    url?: string;
  }
  status: BotStateStatus
}

export type ActionType = 'simple' | 'mention' | 'text' | 'nested' | 'custom';
export type BotStateStatus = 'online' | 'idle' | 'dnd';
export type BotActivityType = 'PLAYING' | 'STREAMING' | 'LISTENING' | 'WATCHING';
