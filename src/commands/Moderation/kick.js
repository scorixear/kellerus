import Command from '../command.js';
import msgHandler from '../../misc/messageHandler.js';
import {dic as language} from '../../misc/languageHandler.js';

export default class Kick extends Command {
  constructor(category) {
    super(category);
    this.usage = `kick <${language.general.user}> [${language.general.reason}]`;
    this.command = 'kick';
    this.description = language.commands.kick.description;
    this.example = 'kick @kellerus\n kick @kellerus he is a bot';
    this.permissions = ['KICK_MEMBERS'];
  }

  executeCommand(args, msg) {
    try {
      super.executeCommand(args, msg);
    } catch (err) {
      return;
    }
    if (!args || args.length == 0) {
      messageHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.error,
        description: language.error.invalid_usage,
        categories: [{
          title: language.general.usage,
          text: `\`${this.usage}\``,
        }],
      });
      return;
    }
    let reason;
    const targetuser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
    const user = msg.guild.member(msg.author);

    if (!targetuser) {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.error,
        description: language.error.user_not_found,
        color: 0xCC0000,
      });
      return;
    }

    if (targetuser.highestRole <= user.highestRole || msg.guild.ownerID == targetuser.id || targetuser.user.bot) {
      msgHandler.sendRichText(msg, language.general.error, [{
        title: language.error.invalid_permissions,
        text: language.commands.kick.error.blocked,
      }], 0xCC0000);
      return;
    }

    if (args.length == 1) {
      reason = undefined;
    } else {
      reason = args.slice(1).join(' ');
    }
    const categories = [];
    if (reason) {
      categories.push({
        'title': language.general.reason,
        'text': reason,
      });
    }

    const usercategories = categories.slice();
    usercategories.push({
      title: language.general.server,
      text: msg.guild.name,
    });
    categories.unshift({
      title: language.general.user,
      text: args[0],
    });
    msgHandler.sendRichTextExplicit(msg.guild, targetuser.user, msg.author,
        language.commands.kick.success, usercategories)
        .then((m) => {
          targetuser.kick(reason).then((member) => {
            msgHandler.sendRichText(msg, language.commands.kick.success, categories);
          });
        });
  }
}
