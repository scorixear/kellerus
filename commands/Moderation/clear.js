import Config from '../../config.js';
import Command from './../command.js';

export default class Clear extends Command {

    constructor(category) {
        super(category);
        this.usage = 'clear <Message Amount>';
        this.command = 'clear';
    }

    executeCommand(args, msg) {
        if (!args[0]) return msg.reply(`Invalid usage! ${Config.prefix}clear <MessageCount>`);
        msg.channel.bulkDelete(parseInt(args[0]) + 1);
        msg.channel.send(`<@${msg.author.id}> cleared the chat`);
    }
}