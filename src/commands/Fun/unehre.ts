import { ChatInputCommandInteraction, SlashCommandUserOption } from 'discord.js';
import LanguageHandler from '../../handlers/languageHandler';
import { CommandInteractionModel, MessageHandler } from 'discord.ts-architecture';

export default class Unehre extends CommandInteractionModel {
  constructor() {
    super('unehre', LanguageHandler.language.commands.unehre.description, 'unehre @kellerus', 'Fun', 'unehre <user>', [
      new SlashCommandUserOption()
        .setName('user')
        .setDescription(LanguageHandler.language.commands.unehre.options.user)
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
        description: LanguageHandler.language.commands.unehre.error.self_remove
      });
      return;
    }
    const count = await sqlHandler.removeHonor(user);
    await MessageHandler.reply({
      interaction,
      title: 'Ehre',
      description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.ehre.success, [
        user.id,
        count.toString()
      ]),
      color: 0x00cc00
    });
  }
}
