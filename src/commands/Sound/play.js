import Command from './../command.js';
import permHandler from '../../misc/permissionHandler.js';
import basedir from '../../../basedir';
const https = require('https');
const config = require('../../config');
const fs = require('fs');
import {downloadFromInfo} from 'ytdl-core';
import msgHandler from '../../misc/messageHandler';
export default class Play extends Command {
  constructor(category) {
    super(category);
    this.usage = `play < title> `;
    this.command = 'play';
    this.description = 'Plays a SoundFile';
    this.example = 'play badumtsss';
  }

  async executeCommand(args, msg) {
    let voiceChannel;
    try {
      const {fileType} = config.commands.sound.add;
      const hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
      if (hasPermission === false) {
        return;
      }
      const title = args[0] + fileType;
      voiceChannel = msg.member.voice.channel;
      const path = basedir + '/resources/soundeffects/' + title;
      const exists = fs.existsSync(path);
      if (!exists) {
        msgHandler.sendRichTextDefault({
          msg,
          title: 'Crap 💥',
          description: `404: Sound Command \`${args[0]}\` not found :/`,
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
