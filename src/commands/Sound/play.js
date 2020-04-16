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
      const title = args[0].toLowerCase() +'.'+fileType;
      if (params.cat && params.cat != '' && fs.existsSync('./resources/soundeffect/'+params.cat+'/'+title)) {
        playFile('./resources/soundeffect/'+params.cat+'/'+title, msg);
        return;
      } else if (fs.existsSync('./resources/soundeffect/'+title)) {
        playFile('./resources/soundeffect/'+title, msg);
        return;
      } else {
        const folders = fs.readdirSync('./resources/soundeffects/').filter((x)=>fs.lstatSync('./resources/soundeffects/'+x).isDirectory());
        for (const folder of folders) {
          if (fs.existsSync('./resources/soundeffects/'+folder+'/'+title)) {
            playFile('./resources/soundeffects/'+folder+'/'+title);
            return;
          }
        }
      }
      msgHandler.sendRichTextDefault({
        msg,
        title: language.general.error,
        description: replaceArgs(language.commands.play.error, [args[0]]),
      });
      return;
    } catch (err) {
      if (voiceChannel) voiceChannel.leave();
    }
  }

  playFile(path, msg) {
    msg.member.voice.channel.join().then((connection) => {
      const server = localStorage.getServer(msg.guild.id);
      const dispatcher = connection.play(path, {volume: server.volume});
      dispatcher.on('finish', ()=> {
        voiceChannel.leave();
      });
    }).catch(() => {
      if (voiceChannel) voiceChannel.leave();
    });
  }
}
