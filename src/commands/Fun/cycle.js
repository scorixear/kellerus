import Command from './../command.js';
export default class Cycle extends Command {
  constructor(category) {
    super(category);
    this.usage = 'cycle';
    this.command = 'cycle';
    this.description = 'Asks the bot, if he wants to play TheCycle!';
    this.example = 'cycle';
  }

  executeCommand(args, msg) {
    try {
      super.executeCommand(args, msg);
    } catch (err) {
      return;
    }
    msg.channel.send('Ja');
  }
}
