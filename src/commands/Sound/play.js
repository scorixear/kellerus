import Command from './../command.js';
import permHandler from '../../misc/permissionHandler.js';
import config from '../../config';
import fs from 'fs';
import msgHandler from '../../misc/messageHandler';
import {dic as language, replaceArgs} from '../../misc/languageHandler.js';

export default class Play extends Command {
  constructor(category) {
    super(category);
    this.usage = `play <${language.general.title}> `;
    this.command = 'play';
    this.description = () => language.commands.play.description;
    this.example = 'play badumtsss';
  }
  /**
   * Executes the command
   * @param {Array<String>} args the arguments fo the msg
   * @param {Message} msg the msg object
   * @param {*} params added parameters and their argument
   */
  executeCommand(args, msg) {
    let voiceChannel;
    try {
      const {fileType} = config.commands.sound.add;
      const hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
      if (hasPermission === false) {
        return;
      }
      const title = args[0] +'.'+fileType;
      voiceChannel = msg.member.voice.channel;
      const path = './resources/soundeffects/' + title;
      const exists = fs.existsSync(path);
      if (!exists) {
        msgHandler.sendRichTextDefault({
          msg,
          title: language.general.error,
          description: replaceArgs(language.commands.play.error, [args[0]]),
        });
        return;
      }
      voiceChannel.join().then((connection) => {
        const dispatcher = connection.play(path);
        dispatcher.on('finish', (finish)=> {
          voiceChannel.leave();
        });
      }).catch(() => {
        if (voiceChannel) voiceChannel.leave();
      });
    } catch (err) {
      if (voiceChannel) voiceChannel.leave();
    }
  }
}
