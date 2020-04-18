import Command from './../command.js';
import messageHandler from '../../misc/messageHandler.js';
import {dic as language, replaceArgs} from '../../misc/languageHandler.js';

export default class Clear extends Command {
  constructor(category) {
    super(category);
    this.usage = `clear <${language.commands.clear.labels.message_amount}>`;
    this.command = 'clear';
    this.description = () => language.commands.clear.description;
    this.example = 'clear 20';
    this.permissions = ['MANAGE_MESSAGES'];
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
    if (!args[0]) {
      messageHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.error,
        description: language.error.invalid_usage,
        categories: [{
          title: language.general.usage,
          text: `\`${this.usage}\``,
        }],
      });
      return;
    }
    msg.channel.bulkDelete(parseInt(args[0]) + 1);
    msg.channel.send(replaceArgs(language.commands.clear.success, [msg.author.id]));
  }
}
