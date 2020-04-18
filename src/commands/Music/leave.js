import Command from './../command.js';
import msgHandler from '../../misc/messageHandler.js';
import {dic as language} from '../../misc/languageHandler.js';

export default class Leave extends Command {
  constructor(category) {
    super(category);
    this.usage = 'leave';
    this.command = 'leave';
    this.description = () => language.commands.leave.description;
    this.example = 'leave';
    this.permissions = ['MOVE_MEMBERS'];
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

    if (msg.guild.voice.connection) {
      msg.guild.voice.connection.disconnect();
    } else {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.error,
        description: language.commands.leave.error,
        color: 0xCC0000,
      });
    }
  }
}
