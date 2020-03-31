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

/**
 * parses the Command
 * @param {Message} msg
 */
function parseCommand(msg) {
  // if does not start with prefix, return;
  if (msg.content[0] !== config.botPrefix) return;

  const temp = parseCommandParams(msg);
  if (!temp) return;
  const command = temp.command;
  const args = temp.args;
  const params = temp.params;

  let module = commands.find((c) => c.command.toLowerCase() == command.toLowerCase());
  if (!module || !module.executeCommand) {
    const commandOptions = commands.map((c)=>c.command);
    const message = replaceArgs(language.handlers.command.error.unknown, [config.botPrefix]);
    const possible = levenshteinDistance.findClosestMatch(command.toLowerCase(), commandOptions);
    emojiHandler.resolveWithReaction(msg, message, possible, msg.content.substring(command.length + 1), (c, m, a)=> {
      module = commands.find((x)=> x.command.toLowerCase() == c.toLowerCase());
      module.executeCommand(a[0], m, a[1]);
    }, [args, params]);
    return;
  }
  try {
    module.executeCommand(args, msg, params);
  } catch (err) {
    console.log(err);
    msgHandler.sendRichText(msg, language.general.error, [{
      title: language.general.message,
      text: replaceArgs(language.handlers.command.error.generic_error, [config.botPrefix, command]),
    }]);
  }
}

/**
 * Parses a command from the given msg object
 * @param {Message} msg the message object to parse from
 * @return {{command: String, args: Array<String>, params: {}}} the parsed command
 */
function parseCommandParams(msg) {
  const regex = new RegExp('^\\'+`${config.botPrefix}([^ ]+)((?:(?!--).)+)?( +--.+)?$`);
  if (!regex.test(msg.content)) {
    msgHandler.sendRichText(msg, language.general.error, [{
      title: language.general.message,
      text: replaceArgs(language.handlers.command.error.general_format, [config.botPrefix]),
    }]);
    return;
  }
  const regexSplit = regex.exec(msg.content);
  const command = regexSplit[1];
  let args = regexSplit[2];
  let params = regexSplit[3];
  if (args) {
    const argsRegex = /(?: +([^ "]+|"[^"]*"))/g;
    if (!argsRegex.test(args)) {
      msgHandler.sendRichText(msg, language.general.error, [{
        title: language.general.message,
        text: language.handlers.command.error.args_format,
      }]);
      return;
    }
    argsRegex.lastIndex = 0;
    const argsArray = [];
    let temp;
    while (temp = argsRegex.exec(args)) {
      if (temp[1].startsWith('"') && temp[1].endsWith('"')) {
        argsArray.push(temp[1].substring(1, temp[1].length - 1));
      } else {
        argsArray.push(temp[1]);
      }
    }
    args = argsArray;
  } else {
    args = [];
  }
  if (params) {
    const paramsRegex = / +(--[^ ]+)(?: +([^ "-]+|"[^"]*"))?/g;
    if (!paramsRegex.test(params)) {
      msgHandler.sendRichText(msg, language.general.error, [{
        title: language.general.message,
        text: language.handlers.command.error.params_format,
      }]);
      return;
    }
    paramsRegex.lastIndex = 0;
    const rawParams = [];
    let temp;
    while (temp = paramsRegex.exec(params)) {
      rawParams.push(temp[1]);
      if (temp[2]) {
        rawParams.push(temp[2]);
      }
    }
    let lastOption;
    params = {};
    for (let i = 0; i < rawParams.length; i++) {
      let current = rawParams[i];
      if (current.startsWith('--')) {
        lastOption = current.substring(2);
        params[lastOption] = '';
      } else {
        if (current.startsWith('"') && current.endsWith('"')) {
          current = current.substring(1, current.length - 1);
        }
        params[lastOption] = current;
      }
    }
  } else {
    params = {};
  }
  return {command: command, args: args, params: params};
}

export default {
  parseCommand,
  commands,
};
