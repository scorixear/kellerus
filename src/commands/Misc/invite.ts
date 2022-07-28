import { ChatInputCommandInteraction, GuildMember, SlashCommandStringOption, SlashCommandUserOption } from 'discord.js';
import LanguageHandler from '../../handlers/languageHandler';
import { CommandInteractionModel, MessageHandler } from 'discord.ts-architecture';

export default class Invite extends CommandInteractionModel {
  constructor() {
    super(
      'invite',
      LanguageHandler.language.commands.invite.description,
      'invite @kellerus hi you',
      'Misc',
      'invite <user> [message]',
      [
        new SlashCommandUserOption()
          .setName('user')
          .setRequired(true)
          .setDescription(LanguageHandler.language.commands.invite.options.user),
        new SlashCommandStringOption()
          .setName('message')
          .setRequired(false)
          .setDescription(LanguageHandler.language.commands.invite.options.message)
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
    const message = interaction.options.getString('message', false);

    if (user.id === interaction.user.id) {
      await MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.general.error,
        description: LanguageHandler.language.commands.invite.error.self_invite
      });
      return;
    }
    const dmChannel = await user.createDM();
    let finalMessage = '';
    if (interaction.member && interaction.member instanceof GuildMember && interaction.member.voice.channel) {
      finalMessage = LanguageHandler.replaceArgs(LanguageHandler.language.commands.invite.success.voice, [
        interaction.member.displayName,
        interaction.guild?.name ?? '',
        interaction.member.voice.channel.name
      ]);
    } else {
      finalMessage = LanguageHandler.replaceArgs(LanguageHandler.language.commands.invite.success.normal, [
        (interaction.member as GuildMember)?.displayName ?? '',
        interaction.guild?.name ?? ''
      ]);
    }

    if (message) {
      finalMessage += LanguageHandler.replaceArgs(LanguageHandler.language.commands.invite.labels.additional_message, [
        message
      ]);
    }
    await dmChannel.send(finalMessage);
    await MessageHandler.reply({
      interaction,
      title: LanguageHandler.language.commands.invite.labels.success,
      description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.invite.success.approval, [
        member?.displayName ?? ''
      ])
    });
  }
}
