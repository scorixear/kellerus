import { ChatInputCommandInteraction, SlashCommandIntegerOption, TextChannel } from 'discord.js';
import LanguageHandler from '../../handlers/languageHandler';
import { CommandInteractionModel, MessageHandler } from 'discord.ts-architecture';

export default class Clear extends CommandInteractionModel {
  constructor() {
    super('clear', LanguageHandler.language.commands.clear.description, 'clear 20', 'Moderation', 'clear <amount>', [
      new SlashCommandIntegerOption()
        .setName('amount')
        .setDescription(LanguageHandler.language.commands.clear.options.amount)
        .setRequired(true)
    ]);
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }
    const amount = interaction.options.getInteger('amount', true);
    await (interaction.channel as TextChannel)?.bulkDelete(amount + 1);
    await MessageHandler.reply({
      interaction,
      title: LanguageHandler.language.commands.clear.success
    });
  }
}
