import Config from '../../config.js';
import Command from './../command.js';
import msgHandler from '../../misc/messageHandler.js';
import permHandler from '../../misc/permissionHandler.js';

export default class Clear extends Command {

    constructor(category) {
        super(category);
        this.usage = 'clear <Message Amount>';
        this.command = 'clear';
        this.description = 'Deletes recent messages from the current channel.';
        this.example = 'clear 20';
        this.permissions = ['MANAGE_MESSAGES'];
    }

    executeCommand(args, msg) {
        let hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
        if(hasPermission === false) {
            return;
        }
        if (!args[0]) return msgHandler.sendRichText(msg, 'Error', [{title: 'Message', text:`Invalid usage! \`${Config.prefix}${this.usage}\``}]);
        msg.channel.bulkDelete(parseInt(args[0]) + 1);
        msg.channel.send(`<@${msg.author.id}> cleared the chat`);
    }
}