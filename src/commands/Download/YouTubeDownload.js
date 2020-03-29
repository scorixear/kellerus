import Command from './../command.js';
import {dic as language} from './../../misc/languageHandler.js';
import ytdl from 'ytdl-core';
import config from '../../../src/config';
import fs from 'fs';
import basedir from '../../../basedir';
const { MessageAttachment } = require('discord.js');
import msgHandler from '../../misc/messageHandler';
import {replaceArgs} from "./../../misc/languageHandler";

/**
 * Downloads a video from youtube and uploads to discord
 */
export default class YouTubeDownload extends Command {
  constructor(category) {
    super(category);
    this.usage = 'download <youtube-link> <[audio, video]> [params]';
    this.command = 'download';
    this.description = language.commands.download.description;
    this.example = 'download https://www.youtube.com/watch?v=dQw4w9WgXcQ audio' +
        'download https://www.youtube.com/watch?v=dQw4w9WgXcQ video';
  }

  executeCommand(args, msg, params) {
    try {
      super.executeCommand(args, msg);
    } catch (err) {
      return;
    }
    try {
      const link = args[0];
      const type = args[1];
      params = {title: 'Joyride', interpret: 'Chevelle'};
      this.download(msg, link, type, params);
    } catch (err) {
      msgHandler.sendRichTextDefault({msg, title: language.commands.download.error.unexpected_error});
    }

  }

  async download(msg, link, type, params = {}) {
    try {
      const { title, interpret } = params;
      const dirpath = basedir+config.commands.download.ytdownload.path+'/';

      let ytOptions;
      try {
        ytOptions = this.getOptions(msg, type);
      } catch (e) {return;}

      let filename = (title == null && interpret == null ? new Date().toISOString() : `${interpret || ''}-${title || ''}`)+'.'+ytOptions.fileType;
      filename = filename.trim();
      filename = filename.replace(' ', '_')
      const path = dirpath +filename;
      msgHandler.sendRichTextDefault({msg, title: language.commands.download.download_started});
      await ytdl(link, ytOptions.options).pipe(
        fs.createWriteStream(path)
          .on('finish', () => {
            const buffer = fs.readFileSync(path);
            const attachment = new MessageAttachment(buffer, filename);
            msg.channel.send(language.commands.download.download_finished, attachment);
            return;
          }));
    } catch (err) {
      console.log(err);
      throw new Error("Download failed");
      msgHandler.sendRichTextDefault({msg, title: language.commands.download.error.download_failed});
    }
  }

  getOptions(msg, type) {
    try {
      const obj = config.commands.download.ytdownload.downloadFormat[type];
      if(obj == null || Object.keys(obj).length === 0) {
        throw new Error(`No matching download format found for ${type || ''}`);
      }
      return obj;
    } catch (err) {
      const message = replaceArgs(language.commands.download.error.unknown_download_format, [type, config.botPrefix, this.command])
      msgHandler.sendRichTextDefault({msg, title: message});
      throw new Error(`No matching download format found for ${type || ''}`)
    }
  }
}