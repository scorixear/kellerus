import Command from './../command.js';
import {dic as language} from './../../misc/languageHandler.js';
export default class YouTubeDownload extends Command {
  constructor(category) {
    super(category);
    this.usage = 'download < youtube-link>';
    this.command = 'download';
    this.description = language.commands.download.description;
    this.example = 'download https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  }

  executeCommand(args, msg) {
    try {
      super.executeCommand(args, msg);
    } catch (err) {
      return;
    }
    msg.channel.send('Ja');
  }
}
