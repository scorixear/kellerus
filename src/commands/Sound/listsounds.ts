import { ChatInputCommandInteraction, SlashCommandBooleanOption, SlashCommandStringOption, SlashCommandAttachmentOption } from "discord.js";
import LanguageHandler from "../../handlers/languageHandler";
import CommandInteractionHandle from "../../models/CommandInteractionHandle"
import config from "../../config";
import messageHandler from "../../handlers/messageHandler";
import fs from 'fs';
import { Logger, WARNINGLEVEL } from "../../helpers/logger";

export default class ListSounds extends CommandInteractionHandle {
  constructor() {
    super(
      'listsounds',
      () => LanguageHandler.language.commands.listSounds.description,
      'listsounds',
      'Sound',
      'listsounds',
      [],
      false,
    );
  }
  
  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }
    try {
      const files = fs.readdirSync('./resources/soundeffects');
      if (files.length === 0) {
        await messageHandler.replyRichText({
          interaction,
          title: LanguageHandler.language.commands.listSounds.labels.no_sounds,
        });
        return;
      }
      const categories = [];
      const noCategory = ({
        title: LanguageHandler.language.commands.listSounds.labels.noCategory,
        text: '',
        inline: true,
      });
      let counter = 0;
      const {fileType} = config.commands.sound.add;
      files.sort();
      for (let i = 0; i < files.length; i += 1) {
        const f = files[i];
        if (f && f.endsWith('.'+fileType)) {
          counter++;
          const theCommand = (f.substring(0, f.length - 1 - fileType.length));
          noCategory.text += LanguageHandler.replaceArgs(LanguageHandler.language.commands.listSounds.labels.templateEntry, [counter.toString(), theCommand]);
        } else {
          try {
            if (fs.lstatSync('./resources/soundeffects/'+f).isDirectory()) {
              const newCat = {
                title: f,
                text: '',
                inline: true,
              };
              const newFiles = fs.readdirSync('./resources/soundeffects/'+f+'/');
              newFiles.sort();
              let newCounter = 0;
              for (const newf of newFiles) {
                if (newf && newf.endsWith('.'+fileType)) {
                  newCounter++;
                  const theCommand = (newf.substring(0, newf.length - 1 - fileType.length));
                  newCat.text += LanguageHandler.replaceArgs(LanguageHandler.language.commands.listSounds.labels.templateEntry, [newCounter.toString(), theCommand]);
                }
              }
              if (newCounter > 0) {
                categories.push(newCat);
              }
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
      categories.sort((a, b)=>a.title.localeCompare(b.title));
      if (counter != 0) {
        categories.unshift(noCategory);
      }
      await messageHandler.replyRichText({
        interaction,
        title: LanguageHandler.language.commands.listSounds.labels.header,
        categories: categories,
      });
    } catch (err) {
      Logger.Error("ListSounds Unexpected Error", err, WARNINGLEVEL.ERROR);
      await messageHandler.replyRichErrorText({
        interaction,
        title: LanguageHandler.language.general.error,
        description: LanguageHandler.language.commands.add.error.generic_error,
      });
    }
  }
}