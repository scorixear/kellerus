import Command from './../command.js';
import permHandler from '../../misc/permissionHandler.js';
import config from '../../config';
import fs from 'fs';
import msgHandler from '../../misc/messageHandler';
// eslint-disable-next-line no-unused-vars
import {Message} from 'discord.js';
import {dic as language, replaceArgs} from '../../misc/languageHandler.js';
import localStorage from '../../misc/localStorage.js';

export default class Play extends Command {
  constructor(category) {
    super(category);
    this.usage = `play <${language.general.title}> `;
    this.command = 'play';
    this.description = () => language.commands.play.description;
    this.example = 'play badumtsss';
    this.permissions = ['SEND_TTS_MESSAGES'];
  }
  /**
   * Executes the command
   * @param {Array<String>} args the arguments fo the msg
   * @param {Message} msg the msg object
   * @param {*} params added parameters and their argument
   */
  executeCommand(args, msg, params) {
    try {
      try {
        super.executeCommand(args, msg, params);
      } catch (err) {
        return;
      }
      const {fileType} = config.commands.sound.add;
      const title = args[0].toLowerCase() +'.'+fileType;
      const base = './resources/soundeffects/';
      let path = base;
      if (params.cat && params.cat != '' && fs.existsSync(base + params.cat+'/'+title)) {
        path += params.cat + '/' + title;
      } else if (fs.existsSync(base + title)) {
        path += title;
      } else {
        const folders = fs.readdirSync(base).filter((x)=>fs.lstatSync(base+x).isDirectory());
        for (const folder of folders) {
          if (fs.existsSync(base+folder+'/'+title)) {
            path += folder + '/' + title;
            break;
          }
        }
      }
      if (path !== base) {
        this.playFile(path, msg);
        return;
      }
      msgHandler.sendRichTextDefault({
        msg,
        title: language.general.error,
        description: replaceArgs(language.commands.play.error, [args[0]]),
      });
      return;
    } catch (err) {
      console.log(err);
      if (msg.member.voice.channel) msg.member.voice.channel.leave();
    }
  }

  playFile(path, msg) {
    msg.member.voice.channel.join().then((connection) => {
      const server = localStorage.getServer(msg.guild.id);
      const dispatcher = connection.play(path, {volume: server.volume});
      dispatcher.on('finish', ()=> {
        msg.member.voice.channel.leave();
      });
    }).catch(() => {
      if (msg.member.voice.channel) msg.member.voice.channel.leave();
    });
  }
}
