import { ChatInputCommandInteraction, SlashCommandBooleanOption, SlashCommandStringOption, SlashCommandAttachmentOption } from "discord.js";
import LanguageHandler from "../../handlers/languageHandler";
import CommandInteractionHandle from "../../models/CommandInteractionHandle"
import config from "../../config";
import messageHandler from "../../handlers/messageHandler";
import fs from 'fs';
import https from 'https';
import { Logger, WARNINGLEVEL } from "../../helpers/logger";

export default class Add extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [
      new SlashCommandStringOption().setName('title').setDescription(LanguageHandler.language.commands.add.options.title).setRequired(true),
      new SlashCommandAttachmentOption().setName('sound').setDescription(LanguageHandler.language.commands.add.options.sound).setRequired(true),
      new SlashCommandBooleanOption().setName('overwrite').setDescription(LanguageHandler.language.commands.add.options.overwrite).setRequired(false),
      new SlashCommandStringOption().setName('category').setDescription(LanguageHandler.language.commands.add.options.category).setRequired(false),
    ];
    super(
      'add',
      () => LanguageHandler.language.commands.add.description,
      'add badumtsss',
      'Sound',
      'add <title> [overwrite] [category] {soundfile.mp3}',
      commandOptions,
      false,
    );
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      try {
        await super.handle(interaction);
      } catch (err) {
        return;
      }
      const title = interaction.options.getString('title', true);
      const overwrite = interaction.options.getBoolean('overwrite', false);
      const category = interaction.options.getString('category', false);
      const {fileType: allowedFileType, maxFileSize, allowedChars} = config.commands.sound.add;

      if (title.length < 3 || title.length > 20) {
        await messageHandler.replyRichErrorText({
          interaction,
          title: LanguageHandler.language.general.error,
          description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.add.error.title_invalid, [allowedChars])
        });
        return;
      }

      // check if any attachment exists
      const attachment = interaction.options.getAttachment('sound', true);
      const {url, size, name} = attachment;
      if (size > maxFileSize) {
        await messageHandler.replyRichErrorText({
          interaction,
          title: LanguageHandler.language.general.error,
          description: LanguageHandler.language.commands.add.error.file_size,
        });
        return;
      }
      const fileType = name?.split('.')[1];
      if (!(allowedFileType === fileType)) {
        await messageHandler.replyRichErrorText({
          interaction,
          title: LanguageHandler.language.general.error,
          description: LanguageHandler.language.commands.add.error.invalid_format,
        });
        return;
      }
      let path;
      if (category&&category.trim() !== '') {
        if (!fs.existsSync('./resources/soundeffects/'+category)) {
          fs.mkdirSync('./resources/soundeffects/'+category);
        }
        path = `./resources/soundeffects/${category}/${title}.${fileType}`;
      } else {
        path = `./resources/soundeffects/${title}.${fileType}`;
      }
      const exists = fs.existsSync(path);
      if (exists && !overwrite) {
        await messageHandler.replyRichErrorText({
          interaction,
          title: LanguageHandler.language.general.error,
          description: LanguageHandler.language.commands.add.error.already_exists,
        });
        return;
      }
      try {
        await this.download(url, path);
        await messageHandler.replyRichText({
          interaction,
          title: LanguageHandler.language.commands.add.labels.command_added,
          description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.add.success, [title]),
        });
      } catch (err) {
        Logger.Error("Error while downloading sound file", err, WARNINGLEVEL.ERROR);
        await messageHandler.replyRichErrorText({
          interaction,
          title: LanguageHandler.language.general.error,
          description: LanguageHandler.language.commands.add.error.file_saving,
        });
      }
    } catch (err) {
      Logger.Error("AddSoundFile Unexpected Error", err, WARNINGLEVEL.ERROR);
      await messageHandler.replyRichErrorText({
        interaction,
        title: LanguageHandler.language.general.error,
        description: LanguageHandler.language.commands.add.error.generic_error,
      });
    }
  }
  private async download(url: string, dest: string) {
    return new Promise<void>((resolve, reject) => {
      const file = fs.createWriteStream(dest);
      https.get(url, (response)=> {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on("error", (err) => {
        fs.unlink(dest, (e)=> {
          if(e) reject(e);
        });
        reject(err);
      });
    });
  }
}
