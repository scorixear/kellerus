import Command from './../command.js';
import {dic as language} from './../../misc/languageHandler.js';
import ytdl from 'ytdl-core';
import config from '../../../src/config';
import fs from 'fs';
const { MessageAttachment } = require('discord.js');
import msgHandler from '../../misc/messageHandler';
import {replaceArgs} from "./../../misc/languageHandler";

/**
 * Downloads a video from youtube and uploads to discord
 * Note here: Tags are postponed due to the mp3 download returns a un-tag-able stream
 */
export default class YouTubeDownload extends Command {
  constructor(category) {
    super(category);
    this.usage = 'download <youtube-link> [audio (default), video] [params]';
    this.command = 'download';
    this.description = () => language.commands.download.description;
    this.example = 'download https://www.youtube.com/watch?v=dQw4w9WgXcQ audio --filename "Rick Astley- Never gonna give you up"\n' +
        'download https://www.youtube.com/watch?v=dQw4w9WgXcQ video';
  }

  /**
   *
   * @param {Array} args
   * @param {{}} msg
   * @param {{interpret: string, title: string}} params
   */
  executeCommand(args, msg, params) {
    try {
      super.executeCommand(args, msg);
    } catch (err) {
      return;
    }
    try {
      const link = args[0];
      const type = args[1];
      this.download(msg, link, type, params);
    } catch (err) {
      msgHandler.sendRichTextDefault({msg, title: language.commands.download.error.unexpected_error});
    }
  }

  /**
   * Downloads the video itself
   * @param {{}}msg
   * @param {string} link
   * @param {string} type
   * @param {{title, interpret, artist, filename}} params
   * @returns {Promise<void>}
   */
  async download(msg, link, type, params = {}) {
    try {
      if(type == null || type.length <= 1) {
        type = config.commands.download.ytdownload.defaultFormat;
      }

      const dirpath = `./${config.commands.download.ytdownload.path}/`;
      let ytOptions;
      // get options for audio or video download
      try {
        ytOptions = this.getOptions(msg, type);
      } catch (e) {return;}

      // retrieve file tags
      const fileTags = YouTubeDownload.resolveParams(params, 'fileTags') || {};

      // allow audioTags when audio
      let audioTags = false;
      if(type === 'audio') audioTags = YouTubeDownload.resolveParams(params);

      // get infos from youtube
      const infos = await ytdl.getInfo(link);
      // set filename
      let filename = fileTags? fileTags.filename : null;
      if(filename == null || filename === '') {
        filename = infos.title;
      }

      // build filename
      filename = filename+ '.' + ytOptions.fileType;
      filename = filename.trim();
      filename = filename.replace(/ /g, '_');
      filename = filename.replace(/([^a-zA-Z0-9\-&_().])/g, '');
      const path = dirpath + filename;

      // Confirm that download starts
      msgHandler.sendRichTextDefault({ msg, title: language.commands.download.download_started });
      // start download
      const promiseDownload = await new Promise((resolve, reject) => {
        try {
          ytdl(link, ytOptions.options).pipe(
            fs.createWriteStream(path)
              .on('finish', () => {
                resolve(true);
              })
              .on('error', () => {
                resolve(false);
              }));
        } catch (err) {
          reject(err);
        }
      });
      // if download successful, send file to user
      if(promiseDownload) {
        this.sendFile(msg, path, filename);
        return;
      }
      msgHandler.sendRichTextDefault({ msg, title: language.commands.download.error.download_failed});
      return;
    }
    catch (err) {
      console.log(err);
      msgHandler.sendRichTextDefault({ msg, title: language.commands.download.error.download_failed});
      YouTubeDownload.deleteFile(path);
    }
  }

  /**
   * Sends the file to the chat
   * deletes file afterwards
   * @param msg
   * @param path
   * @param filename
   * @returns {Promise<Boolean>}
   */
  async sendFile(msg, path, filename) {
    try {
      const buffer = fs.readFileSync(path);
      const attachment = new MessageAttachment(buffer, filename);
      await msg.channel.send(language.commands.download.download_completed, attachment);
      fs.unlinkSync(path);
      return true;
    } catch (err) {
      YouTubeDownload.deleteFile(path);
      console.log(`Error sending file: ${err}`);
      return false;
    }
  }

  /**
   * Gets options for download type
   * @param msg
   * @param type
   */
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

  /**
   * resolves params object using config file
   * @param params
   * @param paramType
   * @returns {{}|null}
   */
  static resolveParams(params = {}, paramType = 'audioTags') {
    try {
      const myTags = {};
      // read allowed tags from config
      const allowedTags = config.commands.download.ytdownload[paramType] || {};

      // get each key, check if under that key exists sth in params obj. if exists store in tags obj
      for(let key in allowedTags) {
        const value = allowedTags[key];
        const userTag = params[`${key}`];
        if(userTag && userTag.length > 0) {
          myTags[value] = userTag;
        }
      }

      return myTags;
    } catch (err) {
      console.error('resolveParams(): '+JSON.stringify(err));
      return null;
    }
  }

  /**
   * deletes file if exists
   * @param path
   */
  static deleteFile(path) {
    try {
      if(fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    } catch (err) {
      console.error("Error deleting File: "+JSON.stringify(err));
    }
  }
}