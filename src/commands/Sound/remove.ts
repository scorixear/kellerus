import { ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";
import LanguageHandler from "../../handlers/languageHandler";
import CommandInteractionHandle from "../../models/CommandInteractionHandle"
import messageHandler from "../../handlers/messageHandler";
import config from '../../config';
import fs from 'fs';
import { Logger, WARNINGLEVEL } from "../../helpers/logger";

export default class Remove extends CommandInteractionHandle {
  constructor() {
    super(
      'remove',
      () => LanguageHandler.language.commands.remove.description,
      'remove badumtsss',
      'Sound',
      'remove <title>',
      [new SlashCommandStringOption().setName('title').setDescription(LanguageHandler.language.commands.remove.options.title).setRequired(true),
       new SlashCommandStringOption().setName('category').setDescription(LanguageHandler.language.commands.remove.options.category).setRequired(false)],
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
      const {fileType, allowedChars} = config.commands.sound.add;
      const originalTitle = interaction.options.getString('title', true);
      const title = originalTitle + '.' + fileType;

      const category = interaction.options.getString('category', false);
      try {
        if (category && category.trim() !== '' && fs.existsSync('./resources/soundeffects/'+category+'/'+title)) {
          fs.unlinkSync('./resources/soundeffects/'+category+'/'+title);
          if (!fs.readdirSync('./resources/soundeffects/'+category).length) {
            fs.rmdirSync('./resources/soundeffects/'+category);
          }
          await messageHandler.replyRichText({
            interaction,
            title: LanguageHandler.language.commands.remove.labels.removed,
            description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.remove.success, [originalTitle.toLowerCase()]),
          });
          return;
        } else if (fs.existsSync('./resources/soundeffects/'+title)) {
          fs.unlinkSync('./resources/soundeffects/'+title);
          await messageHandler.replyRichText({
            interaction,
            title: LanguageHandler.language.commands.remove.labels.removed,
            description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.remove.success, [originalTitle.toLowerCase()]),
          });
          return;
        } else {
          const folders = fs.readdirSync('./resources/soundeffects/').filter( (x)=>fs.lstatSync('./resources/soundeffects/'+x).isDirectory());
          for (const folder of folders) {
            if (fs.existsSync('./resources/soundeffects/'+folder+'/'+title)) {
              fs.unlinkSync('./resources/soundeffects/'+folder+'/'+title);
              if (!fs.readdirSync('./resources/soundeffects/'+folder).length) {
                fs.rmdirSync('./resources/soundeffects/'+folder);
              }
              await messageHandler.replyRichText({
                interaction,
                title: LanguageHandler.language.commands.remove.labels.removed,
                description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.remove.success, [originalTitle.toLowerCase()]),
              });
              return;
            }
          }
        }
        await messageHandler.replyRichErrorText({
          interaction,
          title: LanguageHandler.language.general.error,
          description: LanguageHandler.language.commands.remove.error.not_found,
        });
      } catch (err) {
        Logger.Error("Error removing sound", err, WARNINGLEVEL.ERROR);
        await messageHandler.replyRichErrorText({
          interaction,
          title: LanguageHandler.language.general.error,
          description: LanguageHandler.language.commands.remove.error.file_deletion,
        });
        return;
      }
    } catch (err) {
      Logger.Error("Remove Unexpected Error", err, WARNINGLEVEL.ERROR);
      await messageHandler.replyRichErrorText({
        interaction,
        title: LanguageHandler.language.general.error,
        description: LanguageHandler.language.commands.add.error.generic_error,
      });
    }
  }
}