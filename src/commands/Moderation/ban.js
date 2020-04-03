import Command from './../command.js';
import msgHandler from '../../misc/messageHandler.js';
// eslint-disable-next-line no-unused-vars
import Discord from 'discord.js';
import {dic as language} from '../../misc/languageHandler.js';

export default class Ban extends Command {
  constructor(category) {
    super(category);
    this.usage = `ban <${language.general.user}> [${language.general.reason}]`;
    this.command = 'ban';
    this.description = () => language.commands.ban.description;
    this.example = 'ban @kellerus\nban @kellerus he is a bot';
    this.permissions = ['BAN_MEMBERS'];
  }
  /**
   * Executes the command
   * @param {Array<String>} args the arguments fo the msg
   * @param {Discord.Message} msg the msg object
   * @param {*} params added parameters and their argument
   */
  executeCommand(args, msg, params) {
    try {
      super.executeCommand(args, msg, params);
    } catch (err) {
      return;
    }
    if (!args || args.length == 0) {
      msgHandler.sendRichTextDefault({
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
    const targetuser = msg.guild.member(msg.mentions.users.first() ||
    msg.guild.members.cache.find((g)=>g.nickname == args[0]));
    const user = msg.guild.member(msg.author);
    if (!targetuser) {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.usage,
        description: language.error.user_not_found,
        color: 0xCC0000,
      });
      return;
    }
    if (targetuser.highestRole <= user.highestRole || msg.guild.ownerID == targetuser.id || targetuser.user.bot) {
      msgHandler.sendRichText(msg, language.general.error, [{
        title: language.error.invalid_permissions,
        text: language.commands.ban.error.blocked,
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
        'title': language.general.reason,
        'text': reasonstring,
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
        language.commands.ban.success, usercategories)
        .then((m) => {
          targetuser.ban(reason).then((member) => {
            msgHandler.sendRichText(msg, language.commands.ban.success, categories);
          });
        });
  }
}
