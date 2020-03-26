import Command from './../command.js';
import sqlHandler from '../../misc/sqlHandler.js';
import msgHandler from '../../misc/messageHandler.js';

export default class Ehre extends Command {
  constructor(category) {
    super(category);
    this.usage = 'ehre';
    this.command = 'ehre';
    this.description = 'Awards `Ehre` points to users, that did something honorable.';
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
      msgHandler.sendRichText_Default({
        msg: msg,
        title: 'Error',
        description: 'You must mention a user!',
        color: 0xcc0000,
      });
      return;
    }

    if (!targetuser) {
      msgHandler.sendRichText_Default({
        msg: msg,
        title: 'Error',
        description: 'User not found',
        color: 0xCC0000,
      });
      return;
    }

    if (targetuser === msg.guild.member(msg.author)) {
      msgHandler.sendRichText_Default({
        msg: msg,
        title: 'Error',
        description: 'You cannot award yourself `Ehre`!',
        color: 0xcc0000,
      });
      return;
    }

    sqlHandler.addHonorCount(targetuser.user).then((cnt) => {
      msgHandler.sendRichText_Default({
        msg: msg,
        title: 'Ehre',
        description: `${targetuser} war \`${cnt}\` mal ehrenvoll.`,
        color: 0x00CC00,
      });
    });
  }
}
