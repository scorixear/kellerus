import { ChatInputCommandInteraction } from 'discord.js';
import LanguageHandler from '../../handlers/languageHandler';
import { CommandInteractionModel, Logger, MessageHandler, WARNINGLEVEL } from 'discord.ts-architecture';
import config from '../../config';

import fs from 'fs';

export default class ListSounds extends CommandInteractionModel {
  constructor() {
    super(
      'listsounds',
      LanguageHandler.language.commands.listSounds.description,
      'listsounds',
      'Sound',
      'listsounds',
      []
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
        await MessageHandler.reply({
          interaction,
          title: LanguageHandler.language.commands.listSounds.labels.no_sounds
        });
        return;
      }
      const categories = [];
      const noCategory = {
        title: LanguageHandler.language.commands.listSounds.labels.noCategory,
        text: '',
        inline: true
      };
      let counter = 0;
      const { fileType } = config.commands.sound.add;
      files.sort();
      for (const f of files) {
        if (f && f.endsWith('.' + fileType)) {
          counter++;
          const theCommand = f.substring(0, f.length - 1 - fileType.length);
          noCategory.text += LanguageHandler.replaceArgs(
            LanguageHandler.language.commands.listSounds.labels.templateEntry,
            [counter.toString(), theCommand]
          );
        } else {
          try {
            if (fs.lstatSync('./resources/soundeffects/' + f).isDirectory()) {
              const newCat = {
                title: f,
                text: '',
                inline: true
              };
              const newFiles = fs.readdirSync('./resources/soundeffects/' + f + '/');
              newFiles.sort();
              let newCounter = 0;
              for (const newf of newFiles) {
                if (newf && newf.endsWith('.' + fileType)) {
                  newCounter++;
                  const theCommand = newf.substring(0, newf.length - 1 - fileType.length);
                  newCat.text += LanguageHandler.replaceArgs(
                    LanguageHandler.language.commands.listSounds.labels.templateEntry,
                    [newCounter.toString(), theCommand]
                  );
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
      categories.sort((a, b) => a.title.localeCompare(b.title));
      if (counter !== 0) {
        categories.unshift(noCategory);
      }
      await MessageHandler.reply({
        interaction,
        title: LanguageHandler.language.commands.listSounds.labels.header,
        categories
      });
    } catch (err) {
      Logger.exception('ListSounds Unexpected Error', err, WARNINGLEVEL.ERROR);
      await MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.general.error,
        description: LanguageHandler.language.commands.add.error.generic_error
      });
    }
  }
}
