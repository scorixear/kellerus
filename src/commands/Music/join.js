import Command from './../command.js';
import msgHandler from '../../misc/messageHandler.js';
import musicPlayer from '../../misc/musicPlayer.js';

export default class Join extends Command {
  constructor(category) {
    super(category);
    this.usage = 'join';
    this.command = 'join';
    this.description = 'Lets the bot join a voice channel or swap to another channel. '+
      'The bot will start playing a title from the queue.';
    this.example = 'join';
    this.permissions = ['MOVE_MEMBERS'];
  }

  executeCommand(args, msg) {
    try {
      super.executeCommand(args, msg);
    } catch (err) {
      return;
    }

    if (msg.member.voice.channel) {
      msg.member.voice.channel.join().then((connection) => {
        musicPlayer.play(connection, msg.member.voice.channel, msg.guild.id, msg.channel);
      });
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: 'Joined',
        description: 'Successfully Joined!',
      });
    } else {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: 'Error',
        description: 'You must be in a voice channel to summon me!',
        color: 0xCC0000,
      });
    }
  }
}
