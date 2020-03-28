import config from './../config.js';
import msgHandler from './../misc/messageHandler.js';
import Fs from 'fs';
import leveshteinDistance from './LevenshteinDistance.js';
import emojiHandler from './EmojiHandler.js';
import discordHandler from './discordHandler.js';

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
  if (msg.content[0] !== config.prefix) return;
  const args = msg.content.substring(config.prefix.length).split(' ');
  const stringCommand = args[0];
  const reactEmojis = [];
  args.splice(0, 1);
  let module = commands.find((c) => c.command.toLowerCase() == stringCommand.toLowerCase());
  if (!module || !module.executeCommand) {
    const stringCommands = commands.map((c)=>c.command);
    const possible = leveshteinDistance.findClosestMatch(stringCommand.toLowerCase(), stringCommands);
    let message = `This command is unknown. Use \`${config.prefix}help\` for a list of commands.`;
    if (possible && possible.length > 0) {
      message += `\n\nDid you mean:`;
      for (let i = 0; i<possible.length; i++) {
        const emoji = emojiHandler.getGlobalDiscordEmoji(i.toString());
        message += `\n${emoji}  \`${possible[i]}`;
        reactEmojis.push(emoji);
        if (args.length > 0) {
          message += ` ${args.join(' ')}`;
        }
        message += '`';
      }
      message += `\n\nReact with the shown number to execute that command!`;
    }

    msgHandler.sendRichText(msg, 'Error', [{
      title: 'Message',
      text: message,
    }]).then((m) => {
      reactEmojis.forEach((e)=>m.react(e));
      return m;
    }).then((m) => {
      m.awaitReactions((react, user) => reactEmojis.includes(react.emoji.name) && user.id === msg.author.id,
          {max: 1, time: 60000, errors: ['time']}).then((collected) => {
        const reaction = collected.first();
        module = commands.find((c) => c.command.toLowerCase() == possible[emojiHandler.getNumberFromEmoji(reaction.emoji.name)].toLowerCase());
        module.executeCommand(args, msg);
      });
    });
    return;
  }
  try {
    module.executeCommand(args, msg);
  } catch (err) {
    console.log(err);
    msgHandler.sendRichText(msg, 'Error', [{
      title: 'Message',
      text: `There was an Error executing the command ${stringCommand}.`,
    }]);
  }
}

export default {
  parseCommand,
  commands: commands,
};
