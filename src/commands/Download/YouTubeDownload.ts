import { AttachmentBuilder, ChatInputCommandInteraction, SlashCommandStringOption } from 'discord.js';
import LanguageHandler from '../../handlers/languageHandler';
import config from '../../config';
import ytdl from 'ytdl-core';
import fs from 'fs';
import { CommandInteractionModel, Logger, MessageHandler, WARNINGLEVEL } from 'discord.ts-architecture';

export default class YouTubedDownload extends CommandInteractionModel {
  constructor() {
    super(
      'download',
      LanguageHandler.language.commands.download.description,
      'download https://www.youtube.com/watch?v=dQw4w9WgXcQ audio Rick Astley- Never gonna give you up\n' +
        'download https://www.youtube.com/watch?v=dQw4w9WgXcQ video',
      'Download',
      'download <youtube-link> [audio (default), video] [fileName]',
      [
        new SlashCommandStringOption()
          .setName('url')
          .setDescription(LanguageHandler.language.commands.download.options.url)
          .setRequired(true),
        new SlashCommandStringOption()
          .setName('type')
          .setDescription(LanguageHandler.language.commands.download.options.type)
          .setRequired(false)
          .addChoices(
            {
              name: 'audio',
              value: 'audio'
            },
            {
              name: 'video',
              value: 'video'
            }
          ),
        new SlashCommandStringOption()
          .setName('filename')
          .setDescription(LanguageHandler.language.commands.download.options.fileName)
          .setRequired(false)
      ]
    );
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    let path = '';
    try {
      try {
        await super.handle(interaction);
      } catch (err) {
        return;
      }
      const url = interaction.options.getString('url', true);
      let type = interaction.options.getString('type', false);
      if (!type) {
        type = config.commands.download.ytdownload.defaultFormat;
      }
      let fileName = interaction.options.getString('filename', false);
      const dirpath = `./${config.commands.download.ytdownload.path}/`;
      let ytOptions: { options: ytdl.downloadOptions; fileType: string };
      // get options for audio or video download
      try {
        ytOptions = await this.getOptions(interaction, type ?? '');
      } catch (e) {
        return;
      }

      // get infos from youtube
      const infos = await ytdl.getInfo(url);
      // set filename
      if (fileName == null || fileName === '') {
        fileName = infos.videoDetails.title;
      }

      // build filename
      fileName = fileName + '.' + ytOptions.fileType;
      fileName = fileName.trim();
      fileName = fileName.replace(/ /g, '_');
      fileName = fileName.replace(/([^a-zA-Z0-9\-&_().])/g, '');
      path = dirpath + fileName;

      // Confirm that download starts
      await MessageHandler.reply({ interaction, title: LanguageHandler.language.commands.download.download_started });
      // start download
      const promiseDownload = await new Promise((resolve, reject) => {
        try {
          ytdl(url, ytOptions.options).pipe(
            fs
              .createWriteStream(path)
              .on('finish', () => {
                resolve(true);
              })
              .on('error', () => {
                resolve(false);
              })
          );
        } catch (err) {
          reject(err);
        }
      });
      // if download successful, send file to user
      if (promiseDownload) {
        await this.sendFile(interaction, path, fileName);
        return;
      }
      await MessageHandler.followUp({
        interaction,
        title: LanguageHandler.language.commands.download.error.download_failed
      });
      return;
    } catch (err) {
      Logger.exception('Error in YoutubeDownload', err, WARNINGLEVEL.ERROR);
      await MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.commands.download.error.download_failed
      });
      this.deleteFile(path);
    }
  }
  /**
   * Sends the file to the chat
   * deletes file afterwards
   * @param {*} msg
   * @param {string} path
   * @param {string} filename
   * @return {Promise<Boolean>}
   */
  async sendFile(interaction: ChatInputCommandInteraction, path: string, fileName: string) {
    try {
      const buffer = fs.readFileSync(path);
      const attachment = new AttachmentBuilder(buffer, { name: fileName });
      if (interaction.replied) {
        await interaction.followUp({
          content: LanguageHandler.language.commands.download.download_completed,
          files: [attachment]
        });
      } else if (interaction.deferred) {
        await interaction.editReply({
          content: LanguageHandler.language.commands.download.download_completed,
          files: [attachment]
        });
      } else {
        await interaction.reply({
          content: LanguageHandler.language.commands.download.download_completed,
          files: [attachment]
        });
      }

      fs.unlinkSync(path);
      return true;
    } catch (err) {
      this.deleteFile(path);
      Logger.exception('Error sending file', err, WARNINGLEVEL.WARN);
      return false;
    }
  }

  /**
   * Gets options for download type
   */
  private async getOptions(interaction: ChatInputCommandInteraction, type: string) {
    try {
      const obj: { options: ytdl.downloadOptions; fileType: string } =
        config.commands.download.ytdownload.downloadFormat[type];
      if (obj == null || Object.keys(obj).length === 0) {
        throw new Error(`No matching download format found for ${type || ''}`);
      }
      return obj;
    } catch (err) {
      const message = LanguageHandler.replaceArgs(
        LanguageHandler.language.commands.download.error.unknown_download_format,
        [type, config.botPrefix, this.command]
      );
      await MessageHandler.replyError({
        interaction,
        title: message
      });
      throw new Error(`No matching download format found for ${type || ''}`);
    }
  }

  /**
   * deletes file if exists
   */
  private deleteFile(path: string) {
    try {
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    } catch (err) {
      Logger.exception('Error deleting file', err, WARNINGLEVEL.WARN);
    }
  }
}
