import { ChatInputCommandInteraction } from "discord.js";
import LanguageHandler from "../../handlers/languageHandler";
import CommandInteractionHandle from "../../models/CommandInteractionHandle"
import messageHandler from "../../handlers/messageHandler";

export default class Countdown extends CommandInteractionHandle {
  constructor() {
    super(
      'count',
      () => LanguageHandler.language.commands.count.description,
      'count',
      'Sound',
      'count',
      [],
      false,
    );
  }
  
  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }
    await messageHandler.replyRichText({
      interaction,
      title: "Ja",
      description: ":arrow_up:",
    });
  }
}