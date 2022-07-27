import { ChatInputCommandInteraction } from "discord.js";
import LanguageHandler from "../../handlers/languageHandler";
import CommandInteractionHandle from "../../models/CommandInteractionHandle"
import messageHandler from "../../handlers/messageHandler";

export default class Ping extends CommandInteractionHandle {
  constructor() {
    super(
      'ping',
      () => LanguageHandler.language.commands.ping.description,
      'ping',
      'Misc',
      'ping',
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
      title: "Pong",
      description: `${discordHandler.client.ws.ping}ms`,
    });
  }
}