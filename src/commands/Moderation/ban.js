import Command from './../command.js';
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
    try {
      super.executeCommand(args, msg);
    } catch (err) {
      return;
    }
    if (!args || args.length == 0) {
      msgHandler.sendRichText(msg, 'Ban Info', [{
        title: 'Usage',
        text: `\`${config.prefix}${this.usage}\``,
      }]);
      return;
    }
    let reason;
    const targetuser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
    const user = msg.guild.member(msg.author);
    if (!targetuser) {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: 'Error',
        description: 'User not found',
        color: 0xCC0000,
      });
      return;
    }
    if (targetuser.highestRole <= user.highestRole || msg.guild.ownerID == targetuser.id || targetuser.user.bot) {
      msgHandler.sendRichText(msg, 'Error', [{
        title: 'Invalid permissions',
        text: 'You cannot ban this user!',
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
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const MM = String(date.getMinutes()).padStart(2, '0');
    date = `${yyyy}/${mm}/${dd} - ${hh}:${MM}`;

    if (reason) {
      reason += ' | ' + date;
    } else {
      reason = date;
    }
    const categories = [];
    if (reasonstring) {
      categories.push({
        'title': 'Reason',
        'text': reasonstring,
      });
    }

    const usercategories = categories.slice();
    usercategories.push({
      title: 'Server',
      text: msg.guild.name,
    });
    categories.unshift({
      title: 'User',
      text: args[0],
    });
    msgHandler.sendRichTextExplicit(msg.guild, targetuser.user, msg.author, 'Banned', usercategories).then((m) => {
      targetuser.ban(reason).then((member) => {
        msgHandler.sendRichText(msg, 'Banned', categories);
      });
    });
  }
}
