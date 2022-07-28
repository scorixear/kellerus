import { ChatInputCommandInteraction, SlashCommandUserOption } from 'discord.js';
import LanguageHandler from '../../handlers/languageHandler';
import { CommandInteractionModel, MessageHandler } from 'discord.ts-architecture';

export default class Ehre extends CommandInteractionModel {
  constructor() {
    super('ehre', LanguageHandler.language.commands.ehre.description, 'ehre @kellerus', 'Fun', 'ehre <user>', [
      new SlashCommandUserOption()
        .setName('user')
        .setDescription(LanguageHandler.language.commands.ehre.options.user)
        .setRequired(true)
    ]);
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }
    const user = interaction.options.getUser('user', true);
    if (user.id === interaction.user.id) {
      await MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.general.error,
        description: LanguageHandler.language.commands.ehre.error.self_award
      });
      return;
    }
    const count = await sqlHandler.addHonorCount(user);
    await MessageHandler.reply({
      interaction,
      title: 'Ehre',
      description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.ehre.success, [
        user.id,
        count.toString()
      ])
    });
  }
}
