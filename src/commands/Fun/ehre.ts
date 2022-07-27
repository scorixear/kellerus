import { ChatInputCommandInteraction, SlashCommandUserOption } from "discord.js";
import LanguageHandler from "../../handlers/languageHandler";
import CommandInteractionHandle from "../../models/CommandInteractionHandle"
import messageHandler from "../../handlers/messageHandler";

export default class Ehre extends CommandInteractionHandle {
  constructor() {
    super(
      'ehre',
      () => LanguageHandler.language.commands.ehre.description,
      'ehre @kellerus',
      'Fun',
      'ehre <user>',
      [ new SlashCommandUserOption().setName('user').setDescription(LanguageHandler.language.commands.ehre.options.user).setRequired(true)],
      false,
    );
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }
    const user = interaction.options.getUser('user', true);
    if(user.id === interaction.user.id) {
      await messageHandler.replyRichErrorText({
        interaction,
        title:  LanguageHandler.language.general.error,
        description: LanguageHandler.language.commands.ehre.error.self_award
      });
      return;
    }
    const count = await sqlHandler.addHonorCount(user);
    await messageHandler.replyRichText({
      interaction,
      title: 'Ehre',
      description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.ehre.success, [user.id, count.toString()])
    });
  }
}