import { ChatInputCommandInteraction, GuildMember, SlashCommandStringOption, SlashCommandUserOption } from 'discord.js';
import LanguageHandler from '../../handlers/languageHandler';
import { CommandInteractionModel, MessageHandler } from 'discord.ts-architecture';

export default class Nick extends CommandInteractionModel {
  constructor() {
    super(
      'nick',
      LanguageHandler.language.commands.nick.description,
      'nick @kellerus Bot',
      'Moderation',
      'nick <user> <nickname> [reason]',
      [
        new SlashCommandUserOption()
          .setName('user')
          .setDescription(LanguageHandler.language.commands.nick.options.user)
          .setRequired(true),
        new SlashCommandStringOption()
          .setName('nickname')
          .setDescription(LanguageHandler.language.commands.nick.options.nickname)
          .setRequired(true),
        new SlashCommandStringOption()
          .setName('reason')
          .setDescription(LanguageHandler.language.commands.nick.options.reason)
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
    const member = (await interaction.guild?.members.fetch(user.id)) as GuildMember;
    const nickname = interaction.options.getString('nickname', true);
    const reason = interaction.options.getString('reason', false);

    const oldNickname = member.nickname;
    const categories = [
      {
        title: LanguageHandler.language.general.user,
        text: `<@${user.id}>`
      },
      {
        title: LanguageHandler.language.commands.nick.labels.nickname,
        text: `\`${oldNickname || member.displayName}\` > \`${nickname}\``
      }
    ];

    if (reason) {
      categories.push({
        title: LanguageHandler.language.general.reason,
        text: reason
      });
    }
    try {
      await member.setNickname(nickname, reason ?? undefined);
      await MessageHandler.reply({
        interaction,
        title: LanguageHandler.language.commands.nick.success,
        categories
      });
    } catch {
      await MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.error.invalid_permissions,
        description: LanguageHandler.language.commands.nick.error.blocked
      });
    }
  }
}
