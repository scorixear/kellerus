const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.js');
const token = config.token;


client.on('ready', () => {
    console.log('Kellerus is online!')
})

client.on('message', msg=>{
    if(msg.content === "Hi")
    {
        msg.reply('Hi Friend');
    }    
})

client.login(token);

