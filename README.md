# Simple bot constructor for [Discord](https://discord.com/)
## Overview
Simple bot constructor for discord, based on [Discord.js](https://discord.js.org/).
<br>
<br>
**Important!** if you want to use **randomMember** slug, you need to turn on option **SERVER MEMBERS INTENT** in your application bot settings
###### Links:
- [Example](https://github.com/insane-ray/discord-bot-example)
- [Visual Editor](https://github.com/insane-ray/discord-bot-ve)

## Requirements
[Node.js](https://nodejs.org/) 12 or newer 

## Installation
`npm i discord-bot-constructor`

## Documentation
See example [here](https://github.com/insane-ray/discord-bot-example).

### 1. Init 
Options:
- `token` - your bot token
- `prefix` - sign to start your command like `/` or `$`
- `config` - see [config](https://github.com/insane-ray/discord-bot-constructor/#2-config) section

Example:
```js
const { BotConstructor } = require("discord-bot-constructor");

const botConstructor = new BotConstructor({
  token: string,
  prefix: string,
  config: BotConfig
});
```

### 2. Config
Options:
- `actions` - list of actions
- `botState` - set bot presence state (optional)
- `i18n` - internalization (optional)

See example [here](https://github.com/insane-ray/discord-bot-example/blob/main/actions.json).

Interface:
```js
BotConfig {
  actions: BotAction[];
  botState?: BotState;
  i18n?: IterableData<string>;
}
```
#### 2.1 Config `actions`
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
- `phrases` - list of text responses (optional), randomly take one from list. 
<br> You can also use slugs in text:
    * `{author}` - insert message author
    * `{mentionedUser}` - insert mentioned user in action (works only witn `mention` action type)
    * `{randomNumber}` - insert random number between 1 and 100
    * `{randomMember}` - insert random guild member (if you want to use this one, you need to turn on option `SERVER MEMBERS INTENT` in your application bot settings)

`Simple` action example:
```js
{
  name: "joke",
  type: "simple",
  helpInfo: "example of usage: '/joke'",
  phrases: [
    "{author}, may be your tell us one?",
    "Random decided, it's time {randomMember} to telling joke",
    "Most people are shocked when they find out how bad I am as an electrician"
  ]
}
```

`Mention` action example:
```js
{
  name: "ping",
  type: "mention",
  helpInfo: "example of usage: '/ping @User'",
  phrases: [
    "{author} pinging {mentionedUser}",
    "{mentionedUser} is not answering"
  ]
}
```

`Text` action example:
```js
{
  name: "random",
  type: "text",
  helpInfo: "example of usage: '/random command' (number, member)",
  children: [
    {
      name: "number",
      type: "nested",
      phrases: [
        "Random number is {randomNumber}"
      ]
    },
    {
      name: "member",
      type: "nested",
      phrases: [
        "Random member is {randomMember}"
      ]
    },
    {
      name: "image",
      type: "nested",
      phrases: [
        "https://cdn.spacetelescope.org/archives/images/wallpaper2/heic1509a.jpg",
        "https://cdn.spacetelescope.org/archives/images/wallpaper2/heic1501a.jpg",
        "https://cdn.spacetelescope.org/archives/images/wallpaper2/heic0506a.jpg",
      ]
    }
  ]
}
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
#### 2.2 Config `botState` (optional)
You can set bot status and presence

Options:
- `activity` - available options:
    * `name` - activity name
    * `type` - activity type:
        * `PLAYING`
        * `STREAMING`
        * `LISTENING`
        * `WATCHING`
    * `url` - url link (optional)
- `status` - available bot statuses:
    * `online`
    * `idle`
    * `dnd`

Example:
```js
{
  activity: {
    name: "testing bot",
    type: "PLAYING"
  },
  status: "online"
}
```

Interface:
```js
BotState {
  activity: {
    name: string;
    type: 'PLAYING' | 'STREAMING' | 'LISTENING' | 'WATCHING';
    url?: string;
  }
  status: 'online' | 'idle' | 'dnd'
}
```

#### 2.3 Config `i18n` (optional)
You can translate default system messages:
- `actionNotFound` - action not found
- `argumentNotFound` - action not found
- `wrongMention` - No user mentioned
- `wrongArgument` - Invalid argument
- `helpInfoList` - '/help list' - to see all actions
- `helpInfoAction` - '/help action' - to get help about specific action
- `helpList` - List of available actions:

Example:
```js
{
  actionNotFound: "action not found",
  argumentNotFound: "action not found",
  wrongMention: "No user mentioned",
  wrongArgument: "Invalid argument",
  helpInfoList: "'/help list' - to see all actions",
  helpInfoAction: "'/help action' - to get help about specific action",
  helpList: "List of available actions:"
}
```
