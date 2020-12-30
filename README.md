# Simple bot constructor for [Discord](https://discord.com/)
## Overview
Simple bot constructor for discord, based on [Discord.js](https://discord.js.org/).
###### Links:
- [Example](https://github.com/insane-ray/discord-bot-example)
- [Visual Editor](https://github.com/insane-ray/discord-bot-ve)

## Requirements
[Node.js](https://nodejs.org/) 12 or newer 

## Documentation
See example [here](https://github.com/insane-ray/discord-bot-example).

#### 1. Init 
Options:
<br>`token` - your copied bot token
<br>`prefix` - sign to start your command like `/` or `$`
<br>`config` - see [config](https://github.com/insane-ray/discord-bot-constructor/#2-config) section

Example:
```js
const { BotConstructor } = require("discord-bot-constructor");

const botConstructor = new BotConstructor({
  token: string,
  prefix: string,
  config: BotConfig
});
```

#### 2. Config
Options:
- `actions` - list of actions
- `botState` - set bot presence state (optional)
- `i18n` - internalization (optional)

See example here

Interface:
```js
BotConfig {
  actions: BotAction[];
  botState?: BotState;
  i18n?: IterableData<string>;
}
```
##### 2.1 Config actions
List of bot actions
<br><br>
Options: 
- `name` - action name
- `type` - list of available action types:
    * `simple` simple action without any params such as **/rand**
    * `mention` action that mention user **/mention @User**
    * `text` action with text parameter **/bot random joke**
    * `nested` for `text` type of action, using for nested text options
- `helpInfo` - needed for `/help` action (optional)
- `children` - combines with `text` action type, contains nested actions (optional)
- `phrases` - list of text responses (optional), you can also use slugs in text:
    * `{author}` - insert message author
    * `{mentionedUser}` - insert mentioned user in action (working only witn `mention` action type)
    * `{randomMember}` - insert random guild member

Simple action example:
```js
{
  name: "joke",
  type: "simple",
  helpInfo: "example of usage: '/joke'",
  phrases: [
    "{author} - you",
    "{randomMember} is a joke",
    "Most people are shocked when they find out how bad I am as an electrician",
    "I started out with nothing, and I still have most of it."
  ]
},
```

Interface:
```js
BotAction {
  name: string;
  type: 'simple' | 'mention' | 'text' | 'nested';
  helpInfo?: string;
  children?: BotAction[];
  phrases?: string[];
}
```
##### 2.2 Config botState (optional)
```js
BotState {
  activity: {
    name: string;
    type: BotActivityType;
    url?: string;
  }
  status: BotStateStatus
}
```

##### 2.3 Config i18n (optional)
You can translate default system messages:
```js
Object {
    actionNotFound: "action not found",
    argumentNotFound: "action not found",
    wrongMention: "No user mentioned",
    wrongArgument: "Invalid argument",
    helpInfoList: "'/help list' - to see all actions",
    helpInfoAction: "'/help action' - to get help about specific action",
    helpList: "List of available actions:"
}
```
