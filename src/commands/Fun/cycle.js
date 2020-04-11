import Command from './../command.js';
import {dic as language} from './../../misc/languageHandler.js';
export default class Cycle extends Command {
  constructor(category) {
    super(category);
    this.usage = 'cycle';
    this.command = 'cycle';
    this.description = () => language.commands.cycle.description;
    this.example = 'cycle';
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
