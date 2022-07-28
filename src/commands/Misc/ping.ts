import { ChatInputCommandInteraction } from 'discord.js';
import LanguageHandler from '../../handlers/languageHandler';
import { CommandInteractionModel, MessageHandler } from 'discord.ts-architecture';

export default class Ping extends CommandInteractionModel {
  constructor() {
    super('ping', LanguageHandler.language.commands.ping.description, 'ping', 'Misc', 'ping', []);
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }
    await MessageHandler.reply({
      interaction,
      title: 'Pong',
      description: `${discordHandler.client.ws.ping}ms`
    });
  }
}
