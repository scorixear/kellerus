import { ChatInputCommandInteraction } from "discord.js";
import LanguageHandler from "../../handlers/languageHandler";
import CommandInteractionHandle from "../../models/CommandInteractionHandle"
import messageHandler from "../../handlers/messageHandler";
import config from '../../config';

export default class Info extends CommandInteractionHandle {
  constructor() {
    super(
      'info',
      () => LanguageHandler.language.commands.info.description,
      'info',
      'Misc',
      'info',
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
    const categories = [];
    categories[0] = {
      title: LanguageHandler.language.commands.info.labels.version,
      text: config.version,
      inline: true,
    };
    categories[1] = {
      title: LanguageHandler.language.commands.info.labels.repository,
      text: config.repository,
      inline: true,
    };
    categories[2] = {
      title: LanguageHandler.language.commands.info.labels.author,
      text: 'Paul Keller',
    };
    await messageHandler.replyRichText({
      interaction, 
      title: 'Bot Info', 
      categories, 
      color: 0xF1C40F
    });
  }
}