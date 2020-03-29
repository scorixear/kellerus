import Command from './../command.js';
import musicPlayer from '../../misc/musicPlayer.js';
import sqlHandler from '../../misc/sqlHandler.js';
import {dic as language} from '../../misc/languageHandler.js';

export default class Skip extends Command {
  constructor(category) {
    super(category);
    this.usage = 'skip';
    this.command = 'skip';
    this.description = language.commands.skip.description;
    this.example = 'skip';
    this.permissions = ['MOVE_MEMBERS'];
  }

  executeCommand(args, msg, params) {
    try {
      super.executeCommand(args, msg, params);
    } catch (err) {
      return;
    }
    if (!servers[msg.guild.id]) {
      servers[msg.guild.id] = {
        queueIndex: 0,
        volume: 1,
      };
    }
    sqlHandler.getQueue(msg.guild.id).then((queue) => {
      if (queue.length > 0) {
        if (msg.guild.voice.connection) {
          musicPlayer.stop(msg);
        }
      }
    });
  }
}
