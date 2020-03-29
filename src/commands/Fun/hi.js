import Command from './../command.js';
import {dic as language} from './../../misc/languageHandler.js';

const replys = language.commands.hi.responses;

export default class Hi extends Command {
  constructor(category) {
    super(category);
    this.usage = 'hi';
    this.command = 'hi';
    this.description = language.commands.hi.description;
    this.example = 'hi\nhi @Kellerus';
  }

  executeCommand(args, msg, params) {
    try {
      super.executeCommand(args, msg, params);
    } catch (err) {
      return;
    }

    if (args && args.length > 0) {
      msg.channel.send(`${args[0]}, ${replys[Math.floor(Math.random() * replys.length)]}`);
    } else {
      msg.reply(replys[Math.floor(Math.random() * replys.length)]);
    }
  }
}
