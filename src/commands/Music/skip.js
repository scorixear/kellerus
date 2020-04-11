import Command from './../command.js';
import musicPlayer from '../../misc/musicPlayer.js';
import sqlHandler from '../../misc/sqlHandler.js';
import {dic as language} from '../../misc/languageHandler.js';

export default class Skip extends Command {
  constructor(category) {
    super(category);
    this.usage = 'skip';
    this.command = 'skip';
    this.description = () => language.commands.skip.description;
    this.example = 'skip';
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
    sqlHandler.getQueue(msg.guild.id).then((queue) => {
      if (msg.guild.voice.connection) {
        musicPlayer.stop(msg);
      }
    });
  }
}
