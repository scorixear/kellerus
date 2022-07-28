import {
  ChannelType,
  ChatInputCommandInteraction,
  SlashCommandChannelOption,
  SlashCommandStringOption
} from 'discord.js';
import LanguageHandler from '../../handlers/languageHandler';
import { CommandInteractionModel, MessageHandler } from 'discord.ts-architecture';

export default class AddChannel extends CommandInteractionModel {
  constructor() {
    super(
      'addchannel',
      LanguageHandler.language.commands.addBotChannel.description,
      'addchannel @general general-$',
      'Moderation',
      'addchannel <channel> <channel-template>',
      [
        new SlashCommandChannelOption()
          .addChannelTypes(ChannelType.GuildVoice)
          .setName('channel')
          .setDescription(LanguageHandler.language.commands.addBotChannel.options.channel)
          .setRequired(true),
        new SlashCommandStringOption()
          .setName('channel-template')
          .setDescription(LanguageHandler.language.commands.addBotChannel.options.channelTemplate)
          .setRequired(true)
      ]
    );
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }

    const channel = interaction.options.getChannel('channel', true);
    const channelTemplate = interaction.options.getString('channel-template', true);

    if (!channelTemplate.includes('$')) {
      await MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.commands.addBotChannel.error.usageTitle,
        description: this.usage
      });
      return;
    }

    if (!(await sqlHandler.saveChannel(channel.id, channelTemplate))) {
      await MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.commands.addBotChannel.error.sqlTitle,
        description: LanguageHandler.language.commands.addBotChannel.error.sqlDescription
      });
      return;
    }
    await MessageHandler.reply({
      interaction,
      title: LanguageHandler.language.commands.addBotChannel.labels.success,
      description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.addBotChannel.labels.description, [
        channel.id,
        channelTemplate
      ])
    });
  }
}
