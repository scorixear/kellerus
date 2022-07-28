import { ChannelType, ChatInputCommandInteraction, SlashCommandChannelOption } from 'discord.js';
import LanguageHandler from '../../handlers/languageHandler';
import { CommandInteractionModel, MessageHandler } from 'discord.ts-architecture';

export default class RemoveChannel extends CommandInteractionModel {
  constructor() {
    super(
      'removechannel',
      LanguageHandler.language.commands.removeBotChannel.description,
      'remove @general',
      'Moderation',
      'remove <channel>',
      [
        new SlashCommandChannelOption()
          .addChannelTypes(ChannelType.GuildVoice)
          .setName('channel')
          .setDescription(LanguageHandler.language.commands.addBotChannel.options.channel)
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

    if (!(await sqlHandler.removeChannel(channel.id))) {
      await MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.removeBotChannel.sqlError,
        description: LanguageHandler.language.addBotChannel.sqlErrorDescription
      });
      return;
    }
    await MessageHandler.reply({
      interaction,
      title: LanguageHandler.language.commands.removeBotChannel.labels.success,
      description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.removeBotChannel.labels.description, [
        channel.id
      ])
    });
  }
}
