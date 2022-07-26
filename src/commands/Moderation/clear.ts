import { ChatInputCommandInteraction, SlashCommandIntegerOption, TextChannel } from "discord.js";
import LanguageHandler from "../../handlers/languageHandler";
import CommandInteractionHandle from "../../models/CommandInteractionHandle"
import messageHandler from "../../handlers/messageHandler";

export default class Clear extends CommandInteractionHandle {
  constructor() {
    super(
      'clear',
      () => LanguageHandler.language.commands.clear.description,
      'clear 20',
      'Moderation',
      'clear <amount>',
      [ new SlashCommandIntegerOption().setName('amount').setDescription(LanguageHandler.language.commands.clear.options.amount).setRequired(true) ],
      true,
    );
  }
  
  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }
    const amount = interaction.options.getInteger('amount', true);
    await (interaction.channel as TextChannel)?.bulkDelete(amount+1);
    await messageHandler.replyRichText({
      interaction,
      title: LanguageHandler.language.commands.clear.success,
    });
  }
}