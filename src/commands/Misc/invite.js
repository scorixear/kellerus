import Command from './../command.js';
import msgHandler from '../../misc/messageHandler.js';
// eslint-disable-next-line no-unused-vars
import Discord from 'discord.js';
import {dic as language, replaceArgs} from '../../misc/languageHandler.js';

export default class Invite extends Command {
  constructor(category) {
    super(category);
    this.usage = 'invite @<user> [--msg <message>]';
    this.command = 'invite';
    this.description = () => language.commands.invite.description;
    this.example = 'invite @kellerus --msg "hi you"';
    this.permissions = ['MOVE_MEMBERS'];
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
    if (args.length < 1) {
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
    const targetuser = msg.guild.member(msg.mentions.users.first() ||
    msg.guild.members.cache.find((g)=>g.nickname == args[0]));
    const author = msg.guild.member(msg.author);
    if (!targetuser) {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.error,
        description: language.error.user_not_found,
      });
      return;
    }
    if (author == targetuser) {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.error,
        description: language.commands.invite.error.self_invite,
      });
      return;
    }
    let message;
    if (author.voice.channel) {
      message = replaceArgs(language.commands.invite.success.voice,
          [author.nickname, msg.guild.name, author.voice.channel.name]);
    } else {
      message = replaceArgs(language.commands.invite.success.normal,
          [author.nickname, msg.guild.name]);
    }
    if (params.msg === '') {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.error,
        description: language.commands.invite.error.msg_empty,
      });
      return;
    } else if (params.msg) {
      message += replaceArgs(language.commands.invite.labels.additional_message, [params.msg]);
    }
    targetuser.send(message).then(() => msgHandler.sendRichTextDefault({
      msg: msg,
      title: language.commands.invite.labels.success,
      description: replaceArgs(language.commands.invite.success.approval, [targetuser.nickname]),
    }));
  }
}
