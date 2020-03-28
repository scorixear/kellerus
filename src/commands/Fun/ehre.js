import Command from './../command.js';
import sqlHandler from '../../misc/sqlHandler.js';
import msgHandler from '../../misc/messageHandler.js';
import {dic as language, replaceArgs} from './../../misc/languageHandler.js';

export default class Ehre extends Command {
  constructor(category) {
    super(category);
    this.usage = 'ehre';
    this.command = 'ehre';
    this.description = language.commands.ehre.description;
    this.example = 'ehre @kellerus';
  }

  executeCommand(args, msg) {
    try {
      super.executeCommand(args, msg);
    } catch (err) {
      return;
    }
    let targetuser;
    if (args && args.length >= 1) {
      targetuser = msg.guild.member(msg.mentions.users.first() || msg.guild.member(args[0]));
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
