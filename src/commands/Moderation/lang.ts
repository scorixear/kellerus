import { AutocompleteInteraction, CacheType, ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";
import LanguageHandler from "../../handlers/languageHandler";
import messageHandler from "../../handlers/messageHandler";
import AutocompleteCommandInteractionHandle from "../../models/AutocompleteCommandInteractionHandle";
import fs from 'fs';

export default class Lang extends AutocompleteCommandInteractionHandle {
  constructor() {
    super(
      'lang',
      () => LanguageHandler.language.commands.lang.description,
      'lang en-EN',
      'Moderation',
      'lang <language>',
      [ new SlashCommandStringOption().setName('language').setDescription(LanguageHandler.language.commands.lang.options.language).setAutocomplete(true).setRequired(true) ],
      true,
    );
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }
    const language = interaction.options.getString('language', true);
    if(!LanguageHandler.changeLanguage(language)) {
      await messageHandler.replyRichErrorText({
        interaction,
        title: LanguageHandler.language.general.error,
        description: LanguageHandler.language.commands.lang.error.not_found,
      });
      return;
    }
    await messageHandler.replyRichText({
      interaction,
      title: LanguageHandler.language.commands.lang.labels.success,
      description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.lang.success, [language]),
    });
  }

  public override async handleAutocomplete(interaction: AutocompleteInteraction<CacheType>): Promise<void> {
    const focusedOption = interaction.options.getFocused();
    const files = fs.readdirSync('./src/assets/language');
    const list = files.map((file)=>file.replace('.json', ''));
    const filtered = list.filter((item) => item.startsWith(focusedOption));
    await interaction.respond(filtered?.map(choice => ({name: choice, value: choice}))??[]);
  }
}