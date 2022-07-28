import { ChatInputCommandInteraction } from 'discord.js';
import LanguageHandler from '../../handlers/languageHandler';
import { CommandInteractionModel, MessageHandler } from 'discord.ts-architecture';

export default class Cycle extends CommandInteractionModel {
  constructor() {
    super('cycle', LanguageHandler.language.commands.cycle.description, 'cycle', 'Fun', 'cycle', []);
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
