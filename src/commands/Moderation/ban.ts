import { ChatInputCommandInteraction, GuildMember, SlashCommandStringOption, SlashCommandUserOption } from 'discord.js';
import LanguageHandler from '../../handlers/languageHandler';
import { CommandInteractionModel, MessageHandler } from 'discord.ts-architecture';

export default class Ban extends CommandInteractionModel {
  constructor() {
    super(
      'ban',
      LanguageHandler.language.commands.ban.description,
      'ban @kellerus he is a bot',
      'Moderation',
      'ban <user> [reason]',
      [
        new SlashCommandUserOption()
          .setName('user')
          .setDescription(LanguageHandler.language.commands.ban.options.user)
          .setRequired(true),
        new SlashCommandStringOption()
          .setName('reason')
          .setDescription(LanguageHandler.language.commands.ban.options.reason)
          .setRequired(false)
      ]
    );
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }
    const user = interaction.options.getUser('user', true);
    const member = await interaction.guild?.members.fetch(user.id);
    const reason = interaction.options.getString('reason', false);

    if (
      (member &&
        interaction.member &&
        interaction.member instanceof GuildMember &&
        member.roles.highest.position >= interaction.member.roles.highest.position) ||
      (interaction.guild && interaction.guild.ownerId === user.id) ||
      user.bot ||
      !member?.bannable
    ) {
      await MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.error.invalid_permissions,
        description: LanguageHandler.language.commands.ban.error.blocked
      });
      return;
    }

    const categories: { title: string; text: string }[] = [];
    if (reason) {
      categories.push({
        title: LanguageHandler.language.general.reason,
        text: reason
      });
    }
    categories.unshift({
      title: LanguageHandler.language.general.user,
      text: '<@' + user.id + '>'
    });
    await member?.ban({
      reason: reason ?? undefined
    });
    await MessageHandler.reply({
      interaction,
      title: LanguageHandler.language.commands.ban.success,
      categories
    });
  }
}
