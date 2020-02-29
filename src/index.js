import CmdHandler from './misc/commandHandler.js';
import DiscordHandler from './misc/discordHandler.js';
import config from './config.js';

DiscordHandler.client.on('ready', () => {
    console.log('Kellerus is online!')
});

DiscordHandler.client.on('message', CmdHandler? CmdHandler.parseCommand : ()=>{});

DiscordHandler.client.login(config.token);

