import Command from './../command.js';
import msgHandler from '../../misc/messageHandler.js';
import musicPlayer from '../../misc/musicPlayer.js';
import {dic as language} from '../../misc/languageHandler.js';

export default class Join extends Command {
  constructor(category) {
    super(category);
    this.usage = 'join';
    this.command = 'join';
    this.description = () => language.commands.join.description;
    this.example = 'join';
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
    if (msg.member.voice.channel) {
      msg.member.voice.channel.join().then((connection) => {
        musicPlayer.play(connection, msg.member.voice.channel, msg.guild.id, msg.channel);
      });
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: language.commands.join.labels.joined,
        description: language.commands.join.success,
      });
    } else {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.error,
        description: language.commands.join.error,
        color: 0xCC0000,
      });
    }
  }
}
