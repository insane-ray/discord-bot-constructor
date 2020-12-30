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
<br>**config** - see [config](https://github.com/insane-ray/discord-bot-constructor/#documentation) section

```js
const { BotConstructor } = require("discord-bot-constructor");

const botConstructor = new BotConstructor({
  token: string,
  prefix: string,
  config: BotConfig
});
```

#### 2. Config
