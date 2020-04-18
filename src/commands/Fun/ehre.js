import Command from './../command.js';
import sqlHandler from '../../misc/sqlHandler.js';
import msgHandler from '../../misc/messageHandler.js';
// eslint-disable-next-line no-unused-vars
import {Message} from 'discord.js';
import {dic as language, replaceArgs} from './../../misc/languageHandler.js';

class Ehre extends Command {
  constructor(category) {
    super(category);
    this.usage = 'ehre <user>';
    this.command = 'ehre';
    this.description = () => language.commands.ehre.description;
    this.example = 'ehre @kellerus';
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
    let targetuser;
    if (args && args.length >= 1) {
      targetuser = msg.guild.member(msg.mentions.users.first() ||
      msg.guild.members.cache.find((g)=>g.nickname == args[0]));
    } else {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.error,
        description: language.error.user_mention,
        color: 0xcc0000,
      });
      return;
    }

    if (!targetuser) {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.error,
        description: language.error.user_not_found,
        color: 0xCC0000,
      });
      return;
    }

    if (targetuser === msg.guild.member(msg.author)) {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.error,
        description: language.commands.ehre.error.self_award,
        color: 0xcc0000,
      });
      return;
    }

    sqlHandler.addHonorCount(targetuser.user).then((cnt) => {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: 'Ehre',
        description: replaceArgs(language.commands.ehre.success, [targetuser, cnt]),
        color: 0x00CC00,
      });
    });
  }
}

class Unehre extends Command {
  constructor(category) {
    super(category);
    this.usage = 'unehre <user>';
    this.command = 'unehre';
    this.permissions = ['KICK_MEMBERS'];
    this.description = () => language.commands.unehre.description;
    this.example = 'unehre @kellerus';
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
    let targetuser;
    if (args && args.length >= 1) {
      targetuser = msg.guild.member(msg.mentions.users.first() ||
      msg.guild.members.cache.find((g)=>g.nickname == args[0]));
    } else {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.error,
        description: language.error.user_mention,
        color: 0xcc0000,
      });
      return;
    }

    if (!targetuser) {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.error,
        description: language.error.user_not_found,
        color: 0xCC0000,
      });
      return;
    }

    if (targetuser === msg.guild.member(msg.author)) {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.error,
        description: language.commands.unehre.error.self_remove,
        color: 0xcc0000,
      });
      return;
    }

    sqlHandler.removeHonor(targetuser.user).then((cnt) => {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: 'Ehre',
        description: replaceArgs(language.commands.unehre.success, [targetuser, cnt]),
        color: 0x00CC00,
      });
    });
  }
}
const commands = [Ehre, Unehre];
export {
  commands,
};
