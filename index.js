import Discord from 'discord.js'
import Config from './config.js'
import CmdHandler from './misc/commandHandler.js'

const client = new Discord.Client();
const token = Config.token;


client.on('ready', () => {
    console.log('Kellerus is online!')
})

client.on('message', CmdHandler? CmdHandler.parseCommand : ()=>{});

client.login(token);

