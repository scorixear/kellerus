import Command from './../command.js';
import msgHandler from '../../misc/messageHandler.js';
import discordHandler from '../../misc/discordHandler.js';
import {dic as language} from '../../misc/languageHandler.js';

export default class Ping extends Command {
  constructor(category) {
    super(category);
    this.usage = 'ping';
    this.command = 'ping';
    this.description = language.commands.ping.description;
    this.example = 'ping';
  }

  executeCommand(args, msg, params) {
    try {
      super.executeCommand(args, msg, params);
    } catch (err) {
      return;
    }
    msgHandler.sendRichTextDefault({
      msg: msg,
      title: 'Pong',
      description: `${discordHandler.client.ws.ping}ms`,
    });
  }
}
