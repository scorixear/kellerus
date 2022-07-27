import { ChatInputCommandInteraction } from "discord.js";
import LanguageHandler from "../../handlers/languageHandler";
import CommandInteractionHandle from "../../models/CommandInteractionHandle"
import messageHandler from "../../handlers/messageHandler";

export default class Cycle extends CommandInteractionHandle {
  constructor() {
    super(
      'cycle',
      () => LanguageHandler.language.commands.cycle.description,
      'cycle',
      'Fun',
      'cycle',
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