import Command from './../command.js';
import {dic as language} from './../../misc/languageHandler.js';
export default class Cycle extends Command {
  constructor(category) {
    super(category);
    this.usage = 'cycle';
    this.command = 'cycle';
    this.description = language.commands.cycle.description;
    this.example = 'cycle';
  }

  executeCommand(args, msg, params) {
    try {
      super.executeCommand(args, msg, params);
    } catch (err) {
      return;
    }
    msg.channel.send('Ja');
  }
}
