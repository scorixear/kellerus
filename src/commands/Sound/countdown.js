import Command from './../command.js';
import {dic as language} from './../../misc/languageHandler.js';
export default class CountDown extends Command {
  constructor(category) {
    super(category);
    this.usage = 'count';
    this.command = 'count';
    this.description = () => language.commands.count.description;
    this.example = 'count';
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
    msg.channel.send('Ja');
  }
}
