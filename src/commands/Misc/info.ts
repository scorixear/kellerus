import { ChatInputCommandInteraction } from 'discord.js';
import LanguageHandler from '../../handlers/languageHandler';
import { CommandInteractionModel, MessageHandler } from 'discord.ts-architecture';

import config from '../../config';

export default class Info extends CommandInteractionModel {
  constructor() {
    super('info', LanguageHandler.language.commands.info.description, 'info', 'Misc', 'info', []);
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }
    const categories = [];
    categories[0] = {
      title: LanguageHandler.language.commands.info.labels.version,
      text: config.version,
      inline: true
    };
    categories[1] = {
      title: LanguageHandler.language.commands.info.labels.repository,
      text: config.repository,
      inline: true
    };
    categories[2] = {
      title: LanguageHandler.language.commands.info.labels.author,
      text: 'Paul Keller'
    };
    await MessageHandler.reply({
      interaction,
      title: 'Bot Info',
      categories,
      color: 0xf1c40f
    });
  }
}
