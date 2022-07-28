import {
  ChannelType,
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandChannelOption,
  VoiceChannel
} from 'discord.js';
import LanguageHandler from '../../handlers/languageHandler';
import { CommandInteractionModel, MessageHandler } from 'discord.ts-architecture';

export default class Move extends CommandInteractionModel {
  constructor() {
    super('move', LanguageHandler.language.commands.move.description, 'move #Gaming', 'Misc', 'move <channel>', [
      new SlashCommandChannelOption()
        .setName('channel')
        .setDescription(LanguageHandler.language.commands.move.options.channel)
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true)
    ]);
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }
    const channel = interaction.options.getChannel('channel', true) as VoiceChannel;
    let userstring = '';
    if (interaction.member && interaction.member instanceof GuildMember && interaction.member.voice.channel) {
      const users = interaction.member.voice.channel.members;
      users.forEach((user: GuildMember) => {
        user.voice.setChannel(channel);
        userstring += `<@${user.id}>\n`;
      });
    } else {
      await MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.general.error,
        description: LanguageHandler.language.commands.move.error.no_channel
      });
      return;
    }
    await MessageHandler.reply({
      interaction,
      description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.move.labels.success, [
        channel.id,
        userstring
      ])
    });
  }
}
