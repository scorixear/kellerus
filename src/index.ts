import { SqlHandler } from './handlers/sqlHandler';
import dotenv from 'dotenv';
import {
  CommandInteractionModel,
  DiscordHandler,
  InteractionHandler,
  Logger,
  TwoWayMap,
  WARNINGLEVEL
} from 'discord.ts-architecture';
import { GatewayIntentBits, Partials } from 'discord.js';
import { VoiceEventHandler } from './handlers/voiceEventHandler';
import Help from './commands/Misc/help';
import YouTubedDownload from './commands/Download/YouTubeDownload';
import Paper from './commands/Fun/RockPaperScissor/paper';
import Rock from './commands/Fun/RockPaperScissor/rock';
import Scissor from './commands/Fun/RockPaperScissor/scissor';
import Cycle from './commands/Fun/cycle';
import Ehre from './commands/Fun/ehre';
import Hi from './commands/Fun/hi';
import Unehre from './commands/Fun/unehre';
import Info from './commands/Misc/info';
import Invite from './commands/Misc/invite';
import Move from './commands/Misc/move';
import Ping from './commands/Misc/ping';
import AddChannel from './commands/Moderation/addBotChannel';
import Ban from './commands/Moderation/ban';
import Clear from './commands/Moderation/clear';
import Kick from './commands/Moderation/kick';
import Lang from './commands/Moderation/lang';
import Nick from './commands/Moderation/nick';
import RemoveChannel from './commands/Moderation/removeBotChannel';
import Add from './commands/Sound/add';
import Countdown from './commands/Sound/countdown';
import ListSounds from './commands/Sound/listsounds';
import Play from './commands/Sound/play';
import Remove from './commands/Sound/remove';

// initialize configuration
dotenv.config();

declare global {
  /* eslint-disable-next-line */
  var discordHandler: DiscordHandler;
  /* eslint-disable-next-line */
  var interactionHandler: InteractionHandler;
  /* eslint-disable-next-line */
  var sqlHandler: SqlHandler;
}
const help = new Help();
const commandInteractions: CommandInteractionModel[] = [
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
  new Remove()
];

global.interactionHandler = new InteractionHandler(new TwoWayMap(new Map()), commandInteractions, () => {
  help.init(commandInteractions);
});
global.discordHandler = new DiscordHandler(
  [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
  [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
);
global.sqlHandler = new SqlHandler();

discordHandler.on('interactionCreate', (interaction) => global.interactionHandler.handle(interaction));
discordHandler.on('voiceStateUpdate', (oldState, newState) =>
  VoiceEventHandler.handleVoiceStateUpdate(oldState, newState)
);

process.on('uncaughtException', (err: Error) => {
  Logger.exception('Uncaught Exception', err, WARNINGLEVEL.ERROR);
});
process.on('unhandledRejection', (reason) => {
  Logger.exception('Unhandled Rejection', reason, WARNINGLEVEL.ERROR);
});

sqlHandler.initDB().then(async () => {
  await discordHandler.login(process.env.DISCORD_TOKEN ?? '');
  await interactionHandler.init(process.env.DISCORD_TOKEN ?? '', process.env.CLIENTID ?? '', discordHandler);
  Logger.info('Bot is ready');
});
