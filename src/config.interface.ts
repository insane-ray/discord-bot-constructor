export interface BotConfig {
  actions: BotAction[];
  botState?: BotState;
  i18n?: {[key: string]: string};
}

export interface BotAction {
  name: string;
  type: ActionType;
  helpInfo?: string;
  phrases?: string[];
  children?: BotAction[];
}

export interface BotState {
  activity: {
    name: string;
    type: BotActivityType;
    url?: string;
  }
  status: BotStateStatus
}

export type ActionType = 'simple' | 'mention' | 'text' | 'nested';
export type BotStateStatus = 'online' | 'idle' | 'dnd';
export type BotActivityType = 'PLAYING' | 'STREAMING' | 'LISTENING' | 'WATCHING';
