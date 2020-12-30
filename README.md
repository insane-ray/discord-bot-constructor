# Simple bot constructor for [Discord](https://discord.com/)
## Overview
Simple bot constructor for discord, based on [Discord.js](https://discord.js.org/).
##### Links
- [Example](https://github.com/insane-ray/discord-bot-example)
- [Visual Editor](https://github.com/insane-ray/discord-bot-ve)

## Requirements
[Node.js](https://nodejs.org/) 12 or newer 

## Documentation
See example [here](https://github.com/insane-ray/discord-bot-example).

#### 1. Init 
**token** - your copied bot token
<br>**prefix** - sign to start your command like `/` or `$`
<br>**config** - see [config](https://github.com/insane-ray/discord-bot-constructor/#2-config) section

```js
const { BotConstructor } = require("discord-bot-constructor");

const botConstructor = new BotConstructor({
  token: string,
  prefix: string,
  config: BotConfig
});
```

#### 2. Config
```js
BotConfig {
  actions: BotAction[];
  botState?: BotState;
  i18n?: IterableData<string>;
}
```

##### 2.3 Config i18n
You can translate default system messages:
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
