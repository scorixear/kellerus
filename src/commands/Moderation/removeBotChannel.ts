import { ChannelType, ChatInputCommandInteraction, SlashCommandChannelOption, SlashCommandStringOption } from "discord.js";
import LanguageHandler from "../../handlers/languageHandler";
import CommandInteractionHandle from "../../models/CommandInteractionHandle"
import messageHandler from "../../handlers/messageHandler";

export default class RemoveChannel extends CommandInteractionHandle {
  constructor() {
    super(
      'removechannel',
      () => LanguageHandler.language.commands.count.description,
      'remove @general',
      'Moderation',
      'remove <channel>',
      [ new SlashCommandChannelOption().addChannelTypes(ChannelType.GuildVoice).setName('channel').setDescription(LanguageHandler.language.commands.addBotChannel.options.channel).setRequired(true),],
      true,
    );
  }
  
  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }

    const channel = interaction.options.getChannel('channel', true);


    if(!await sqlHandler.removeChannel(channel.id)) {
      await messageHandler.replyRichErrorText({
        interaction,
        title: LanguageHandler.language.removeBotChannel.sqlError,
        description: LanguageHandler.language.addBotChannel.sqlErrorDescription,
      });
      return;
    }
    await messageHandler.replyRichText({
      interaction,
      title: LanguageHandler.language.commands.removeBotChannel.labels.success,
      description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.removeBotChannel.labels.description, [channel.id])
    })
    
  }
}