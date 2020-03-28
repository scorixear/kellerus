import config from './../config.js';
import msgHandler from './../misc/messageHandler.js';
import Fs from 'fs';
import emojiHandler from './EmojiHandler.js';
import levenshteinDistance from './LevenshteinDistance.js';
import {dic as language, replaceArgs} from './languageHandler.js';

const commandFiles = Fs.readdirSync('./src/commands/');
const commands = [];
commandFiles.forEach((folder) => {
  if (folder !== 'command.js') {
    Fs.readdirSync(`./src/commands/${folder}/`).forEach((file) => {
      if (file.endsWith('.js')) {
        const command = require(`./../commands/${folder}/${file}`);
        console.log(command);
        if (command.commands) {
          for (const cmd of command.commands) {
            commands.push(Reflect.construct(cmd, [folder]));
          }
        } else {
          commands.push(Reflect.construct(command.default, [folder]));
        }
      }
    });
  }
});

function parseCommand(msg) {
  if (msg.content[0] !== config.botPrefix) return;
  const args = msg.content.substring(config.botPrefix.length).split(' ');
  const stringCommand = args[0];
  args.splice(0, 1);
  let module = commands.find((c) => c.command.toLowerCase() == stringCommand.toLowerCase());
  if (!module || !module.executeCommand) {
    const stringCommands = commands.map((c)=>c.command);
    const message = replaceArgs(language.handlers.command.error.unknown, [config.botPrefix]);
    const possible = levenshteinDistance.findClosestMatch(stringCommand.toLowerCase(), stringCommands);
    emojiHandler.resolveWithReaction(msg, message, possible, args, (c, m, a)=> {
      module = commands.find((x)=> x.command.toLowerCase() == c.toLowerCase());
      module.executeCommand(a, m);
    }, args);
    return;
  }
  try {
    module.executeCommand(args, msg);
  } catch (err) {
    console.log(err);
    msgHandler.sendRichText(msg, language.general.error, [{
      title: language.general.message,
      text: replaceArgs(language.handlers.command.error.generic_error, [config.botPrefix, stringCommand]),
    }]);
  }
}

export default {
  parseCommand,
  commands,
};
