import { ChatInputCommandInteraction } from 'discord.js';
import LanguageHandler from '../../handlers/languageHandler';
import { CommandInteractionModel, MessageHandler } from 'discord.ts-architecture';

export default class Countdown extends CommandInteractionModel {
  constructor() {
    super('count', LanguageHandler.language.commands.count.description, 'count', 'Sound', 'count', []);
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }
    await MessageHandler.reply({
      interaction,
      title: 'Ja',
      description: ':arrow_up:'
    });
  }
}
