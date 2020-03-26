import Command from './../command.js';
import msgHandler from '../../misc/messageHandler.js';

export default class Leave extends Command {
  constructor(category) {
    super(category);
    this.usage = 'leave';
    this.command = 'leave';
    this.description = 'Kicks the bot from the voice channel.';
    this.example = 'leave';
    this.permissions = ['MOVE_MEMBERS'];
  }

  executeCommand(args, msg) {
    try {
      super.executeCommand(args, msg);
    } catch (err) {
      return;
    }

    if (msg.guild.voice.connection) {
      msg.guild.voice.connection.disconnect();
    } else {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: 'Error',
        description: 'I must be in a voice channel to be banished!',
        color: 0xCC0000,
      });
    }
  }
}
