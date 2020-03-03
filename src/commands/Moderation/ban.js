import Command from './../command.js';
import permHandler from '../../misc/permissionHandler.js';
import msgHandler from '../../misc/messageHandler.js';
import config from '../../config.js';

export default class Ban extends Command {

    constructor(category) {
        super(category);
        this.usage = 'ban <user> [reason]';
        this.command = 'ban';
        this.description = 'Bans a player with an optional reason.';
        this.example = 'ban @kellerus\nban @kellerus he is a bot';
        this.permissions = ['BAN_MEMBERS'];
    }

    executeCommand(args, msg) {
        let hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
        if (hasPermission === false) {
            return;
        }
        if (!args || args.length == 0) {
            msgHandler.sendRichText(msg.channel, 'Ban Info', [{
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
                channel: msg.channel,
                title: 'Error',
                description: 'User not found',
                color: 0xCC0000
            });
            return;
        }
        if (targetuser.highestRole <= user.highestRole || msg.guild.ownerID == targetuser.id || targetuser.user.bot) {
            msgHandler.sendRichText(msg.channel, 'Error', [{
                title: 'Invalid permissions',
                text: 'You cannot ban this user!'
            }], 0xCC0000);
            return;
        }
        let reasonstring;
        if (args.length == 1) {
            reason = undefined;
            reasonstring = undefined;
        } else {
            reason = args.slice(1).join(' ');
            reasonstring = args.slice(1).join(' ');
        }

        let date = new Date();
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = date.getFullYear();
        let hh = String(date.getHours()).padStart(2, '0');
        let MM = String(date.getMinutes()).padStart(2, '0');
        date = `${yyyy}/${mm}/${dd} - ${hh}:${MM}`;

        if (reason) {
            reason += ' | ' + date;
        } else {
            reason = date;
        }
        let categories = [];
        if (reasonstring) {
            categories.push({
                title: 'Reason',
                'text': reasonstring
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
        msgHandler.sendRichText(targetuser.user, 'Banned', usercategories).then(m => {
            targetuser.ban(reason).then(member => {
                msgHandler.sendRichText(msg.channel, 'Banned', categories)
            });
        });


    }
}