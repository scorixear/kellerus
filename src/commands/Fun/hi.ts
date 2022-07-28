import { ChatInputCommandInteraction, SlashCommandUserOption } from 'discord.js';
import LanguageHandler from '../../handlers/languageHandler';
import { CommandInteractionModel } from 'discord.ts-architecture';

export default class Hi extends CommandInteractionModel {
  constructor() {
    super('hi', LanguageHandler.language.commands.hi.description, 'hi\nhi @kellerus', 'Fun', 'hi [user]', [
      new SlashCommandUserOption()
        .setName('user')
        .setDescription(LanguageHandler.language.commands.hi.options.user)
        .setRequired(false)
    ]);
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }
    const user = interaction.options.getUser('user', false);
    const replys = LanguageHandler.language.commands.hi.responses;
    if (user) {
      await interaction.reply({ content: `<@${user.id}> ${replys[Math.floor(Math.random() * replys.length)]}` });
    } else {
      await interaction.reply({ content: replys[Math.floor(Math.random() * replys.length)] });
    }
  }
}
