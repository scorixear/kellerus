import { AutocompleteInteraction, ButtonInteraction, ChatInputCommandInteraction, Interaction } from 'discord.js';
import { REST } from '@discordjs/rest';
import { InteractionType, Routes } from 'discord-api-types/v10';
import CommandInteractionHandle from '../models/CommandInteractionHandle';
import { Logger, WARNINGLEVEL} from '../helpers/logger';
import AutocompleteCommandInteractionHandle from '../models/AutocompleteCommandInteractionHandle';


export default class InteractionHandler {
  private commandInteractions: CommandInteractionHandle[];
  constructor() {
    this.commandInteractions = [
    ];
  }

  public async Init() {
    for(const interaction of this.commandInteractions) {
      if (interaction.Ready) {
        await interaction.Ready;
      }
    }
    const commands = this.commandInteractions.map(command => command.slashCommandBuilder.toJSON());
    const rest = new REST( {version: '9'}).setToken(process.env.DISCORD_TOKEN??"");

    global.discordHandler.getGuilds().forEach(async guild=> {
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENTID??"", guild.id), {body: commands})
        Logger.Log('Successfully registered application commands for guild', WARNINGLEVEL.INFO, guild.name);
    });
  }

  public async handle(interaction: Interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const commandInteraction: ChatInputCommandInteraction = interaction as ChatInputCommandInteraction;
        const handler = this.commandInteractions.find(interactionHandle => interactionHandle.command === commandInteraction.commandName);
        if (handler) {
          await handler.handle(commandInteraction);
        }
      } else if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        const commandInteraction: AutocompleteInteraction = interaction as AutocompleteInteraction;
        const handler = this.commandInteractions.find(interactionHandler => interactionHandler.command === commandInteraction.commandName && interactionHandler instanceof AutocompleteCommandInteractionHandle);
        if(handler) {
          await (handler as AutocompleteCommandInteractionHandle).handleAutocomplete(commandInteraction)
        }
      } else {
        return;
      }
    } catch (err) {
      Logger.Error("Error while handling interaction", err, WARNINGLEVEL.ERROR);
    }
  }
}