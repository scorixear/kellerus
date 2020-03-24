import Config from '../../config.js';
import Command from './../command.js';
import msgHandler from '../../misc/messageHandler.js';
import permHandler from '../../misc/permissionHandler.js';

export default class Nick extends Command {

    constructor(category) {
        super(category);
        this.usage = 'nick <user> <nick> [Reason]';
        this.command = 'nick';
        this.description = 'Nicks a user.';
        this.example = 'nick @kellerus Bot';
        this.permissions = ['MANAGE_NICKNAMES', 'CHANGE_NICKNAME'];
    }

    executeCommand(args, msg) {
        let hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
        if (hasPermission === false) {
            return;
        }
        if (!args || args.length < 2) return msgHandler.sendRichText(msg, 'Error', [{
            title: 'Message',
            text: `Invalid usage! \`${Config.prefix}${this.usage}\``
        }]);

        let reason;
        let targetuser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));

        if (!targetuser) {
            msgHandler.sendRichText_Default({
                msg: msg,
                title: 'Error',
                description: 'User not found',
                color: 0xCC0000
            });
            return;
        }

        let categories = [{
            title: 'User',
            text: targetuser
        }, {
            title: 'Nickname',
            text: args[1]
        }];
        if (args.length > 2) {
            reason = args.slice(2).join(' ')
            categories.push({
                title: 'Reason',
                text: reason
            });
        }

        targetuser.setNickname(args[1], reason).then(member => {
            msgHandler.sendRichText(msg, 'Nickname changed', categories);
        }).catch(err => {
            console.log(err);
            msgHandler.sendRichText(msg, 'Error', [{
                title: 'Invalid permissions',
                text: 'You cannot nick this user!'
            }], 0xCC0000);
        });
    }
}