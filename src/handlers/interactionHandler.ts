import { AutocompleteInteraction, ButtonInteraction, ChatInputCommandInteraction, Interaction } from 'discord.js';
import { REST } from '@discordjs/rest';
import { InteractionType, Routes } from 'discord-api-types/v10';
import CommandInteractionHandle from '../models/CommandInteractionHandle';
import { Logger, WARNINGLEVEL} from '../helpers/logger';
import AutocompleteCommandInteractionHandle from '../models/AutocompleteCommandInteractionHandle';
import Add from '../commands/Sound/add';
import Countdown from '../commands/Sound/countdown';
import ListSounds from '../commands/Sound/listsounds';
import Play from '../commands/Sound/play';
import Remove from '../commands/Sound/remove';
import AddChannel from '../commands/Moderation/addBotChannel';
import Ban from '../commands/Moderation/ban';
import Clear from '../commands/Moderation/clear';
import Kick from '../commands/Moderation/kick';
import Lang from '../commands/Moderation/lang';
import Nick from '../commands/Moderation/nick';
import RemoveChannel from '../commands/Moderation/removeBotChannel';
import Help from '../commands/Misc/help';
import Info from '../commands/Misc/info';
import Invite from '../commands/Misc/invite';
import Move from '../commands/Misc/move';
import Ping from '../commands/Misc/ping';
import Paper from '../commands/Fun/RockPaperScissor/paper';
import Rock from '../commands/Fun/RockPaperScissor/rock';
import Scissor from '../commands/Fun/RockPaperScissor/scissor';
import Cycle from '../commands/Fun/cycle';
import Ehre from '../commands/Fun/ehre';
import Hi from '../commands/Fun/hi';
import Unehre from '../commands/Fun/unehre';
import YouTubedDownload from '../commands/Download/YouTubeDownload';


export default class InteractionHandler {
  private commandInteractions: CommandInteractionHandle[];
  constructor() {
    const help = new Help();
    this.commandInteractions = [
      new YouTubedDownload(),
      new Paper(),
      new Rock(),
      new Scissor(),
      new Cycle(),
      new Ehre(),
      new Hi(),
      new Unehre(),
      help,
      new Info(),
      new Invite(),
      new Move(),
      new Ping(),
      new AddChannel(),
      new Ban(),
      new Clear(),
      new Kick(),
      new Lang(),
      new Nick(),
      new RemoveChannel(),
      new Add(),
      new Countdown(),
      new ListSounds(),
      new Play(),
      new Remove(),
    ];
    help.init(this.commandInteractions);
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