import Command from './../command.js';
import msgHandler from '../../misc/messageHandler.js';
import {dic as language} from '../../misc/languageHandler.js';

export default class Nick extends Command {
  constructor(category) {
    super(category);
    this.usage = `nick <${language.general.user}> <nick> [${language.general.reason}]`;
    this.command = 'nick';
    this.description = () => language.commands.nick.description;
    this.example = 'nick @kellerus Bot';
    this.permissions = ['MANAGE_NICKNAMES', 'CHANGE_NICKNAME'];
  }
  /**
   * Executes the command
   * @param {Array<String>} args the arguments fo the msg
   * @param {Message} msg the msg object
   * @param {*} params added parameters and their argument
   */
  executeCommand(args, msg, params) {
    try {
      super.executeCommand(args, msg, params);
    } catch (err) {
      return;
    }
    if (!args || args.length < 2) {
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
    const targetuser = msg.guild.member(msg.mentions.users.first() || msg.guild.member.get(args[0]));
    const {nickname: oldNickname} = targetuser;

    if (!targetuser) {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.error,
        description: language.error.user_not_found,
        color: 0xCC0000,
      });
      return;
    }

    const categories = [{
      title: language.general.user,
      text: targetuser,
    }, {
      title: language.commands.nick.labels.nickname,
      text: `\`${oldNickname || targetuser.displayName}\` > \`${args[1]}\``,
    }];

    if (args.length > 2) {
      reason = args.slice(2).join(' ');
      categories.push({
        title: language.general.reason,
        text: reason,
      });
    }

    targetuser.setNickname(args[1], reason).then((member) => {
      msgHandler.sendRichText(msg, language.commands.nick.success, categories);
    }).catch((err) => {
      console.log(err);
      msgHandler.sendRichText(msg, language.general.error, [{
        title: language.error.invalid_permissions,
        text: language.commands.nick.error.blocked,
      }], 0xCC0000);
    });
  }
}
