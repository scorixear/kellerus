import Config from '../../config.js';

function executeCommand(args, msg) {
    if(!args[0]) return msg.reply(`Invalid usage! ${Config.prefix}clear <MessageCount>`);
    msg.channel.bulkDelete(parseInt(args[0]) + 1);
    msg.channel.send(`<@${msg.author.id}> cleared the chat`);
}

let category;

module.exports = {executeCommand, command: 'clear', usage: 'clear <Message Amount>', category};