import Command from './../command.js';
import msgHandler from '../../misc/messageHandler.js';
import discordHandler from '../../misc/discordHandler.js';
import {dic as language} from '../../misc/languageHandler.js';

export default class Ping extends Command {
  constructor(category) {
    super(category);
    this.usage = 'ping';
    this.command = 'ping';
    this.description = () => language.commands.ping.description;
    this.example = 'ping';
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
    msgHandler.sendRichTextDefault({
      msg: msg,
      title: 'Pong',
      description: `${discordHandler.client.ws.ping}ms`,
    });
  }
}
