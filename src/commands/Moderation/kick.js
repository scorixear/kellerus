import Command from '../command.js';
import permHandler from '../../misc/permissionHandler.js';
import msgHandler from '../../misc/messageHandler.js';
import config from '../../config.js';

export default class Kick extends Command {
    constructor(category) {
        super(category);
        this.usage = 'kick <user> [Reason]';
        this.command = 'kick';
        this.description = 'Kicks a user from the server with an optional reason.';
        this.example = 'kick @kellerus\n kick @kellerus he is a bot';
        this.permissions = ['KICK_MEMBERS'];
    }

    executeCommand(args, msg) {
        let hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
        if (hasPermission === false) {
            return;
        }
        if (!args || args.length == 0) {
            msgHandler.sendRichText(msg, 'Kick Info', [{
                title: 'Usage',
                text: `\`${config.prefix}${this.usage}\``
            }]);
            return;
        }
        let reason;
        let targetuser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]))
        let user = msg.guild.member(msg.author);

        if (!targetuser) {
            msgHandler.sendRichText_Default({
                msg: msg,
                title: 'Error',
                description: 'User not found',
                color: 0xCC0000
            });
            return;
        }

        if (targetuser.highestRole <= user.highestRole || msg.guild.ownerID == targetuser.id || targetuser.user.bot) {
            msgHandler.sendRichText(msg, 'Error', [{
                title: 'Invalid permissions',
                text: 'You cannot kick this user!'
            }], 0xCC0000);
            return;
        }

        if (args.length == 1) {
            reason = undefined;
        } else {
            reason = args.slice(1).join(' ');
        }
        let categories = [];
        if (reason) {
            categories.push({
                title: 'Reason',
                'text': reason
            });
        }

        let usercategories = categories.slice();
        usercategories.push({
            title: 'Server',
            text: msg.guild.name
        });
        categories.unshift({
            title: 'User',
            text: args[0]
        });
        msgHandler.sendRichText_Explicit(msg.guild, targetuser.user, msg.author, 'Kicked', usercategories).then(m => {
            targetuser.kick(reason).then(member => {
                msgHandler.sendRichText(msg, 'Kicked', categories);
            });
        });

    }
}