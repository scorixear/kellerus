import Command from './../command.js';
import musicPlayer from '../../misc/musicPlayer.js';
import messageHandler from '../../misc/messageHandler.js';
export default class Vol extends Command {
  constructor(category) {
    super(category);
    this.usage = 'vol <percent>';
    this.command = 'vol';
    this.description = 'Adjust the volume of the bot';
    this.example = 'vol 25';
  }

  executeCommand(args, msg) {
    try {
      super.executeCommand(args, msg);
    } catch (err) {
      return;
    }
    if (args.length != 1 || isNaN(args[0])) {
      messageHandler.sendRichTextDefault({
        msg: msg,
        title: 'Error 💥',
        description: `Invalid usage`,
        categories: [{
          title: 'Usage',
          text: `\`${this.usage}\``,
        }],
      });
      return;
    }
    const volume = parseInt(args[0]) / 100;
    if (volume > 2 || volume <= 0) {
      messageHandler.sendRichTextDefault({
        msg: msg,
        title: 'Error 💥',
        description: 'Volume can only between `0`% and `200`%',
      });
      return;
    }
    musicPlayer.setVolume(msg.guild.id, volume);
    messageHandler.sendRichTextDefault({
      msg: msg,
      title: 'Volume set',
      description: `Volume was set to ${args[0]}%`,
    });
  }
}
