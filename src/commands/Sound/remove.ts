import { AutocompleteInteraction, CacheType, ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";
import LanguageHandler from "../../handlers/languageHandler";
import messageHandler from "../../handlers/messageHandler";
import config from '../../config';
import fs from 'fs';
import { Logger, WARNINGLEVEL } from "../../helpers/logger";
import AutocompleteCommandInteractionHandle from "../../models/AutocompleteCommandInteractionHandle";

export default class Remove extends AutocompleteCommandInteractionHandle {
  constructor() {
    super(
      'remove',
      () => LanguageHandler.language.commands.remove.description,
      'remove badumtsss',
      'Sound',
      'remove <title>',
      [new SlashCommandStringOption().setName('title').setDescription(LanguageHandler.language.commands.remove.options.title).setRequired(true).setAutocomplete(true),
       new SlashCommandStringOption().setName('category').setDescription(LanguageHandler.language.commands.remove.options.category).setRequired(false)],
      false,
    );
  }

  public override async handleAutocomplete(interaction: AutocompleteInteraction<CacheType>): Promise<void> {
    const focused = interaction.options.getFocused();
    const files = fs.readdirSync('./resources/soundeffects');
    let fullchoices: string[] = [];
    const {fileType} = config.commands.sound.add;
    for(const file of files) {
      if (file && file.endsWith('.'+fileType)){
        fullchoices.push(file.substring(0, file.length - 1 - fileType.length));
      } else {
        if(fs.lstatSync('./resources/soundeffects/'+file).isDirectory()) {
          const newFiles = fs.readdirSync('./resources/soundeffects/'+file+'/');
          fullchoices = [...fullchoices, ...newFiles.map(f=> f.substring(0, f.length-1-fileType.length))]
        }
      }
    }
    fullchoices = fullchoices.filter(f=>f.startsWith(focused));
    fullchoices.sort();
    if(fullchoices.length > 25) {
      fullchoices = fullchoices.slice(0, 25);
    }
    await interaction.respond(fullchoices?.map(choice => ({name: choice, value: choice}))??[]);
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