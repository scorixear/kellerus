import discordHandler from './discordHandler';
import messageHandler from './messageHandler';
import {dic as language} from './languageHandler.js';

const numbers = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
const numberString = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

function getCustomGuildEmoji(name, guild) {
  if (!isNaN(name)) {
    name = numberString[name];
  }
  return guild.emojis.cache.find((emoji) => {
    return emoji.name === name;
  });
}

function getCustomClientEmoji(name) {
  if (!isNaN(name)) {
    name = numberString[name];
  }
  return discordHandler.client.emojis.cache.find((emoji) => {
    return emoji.name === name;
  });
}

function getGlobalDiscordEmoji(number) {
  return numbers[number];
}

function getNumberFromEmoji(emoji) {
  return numbers.indexOf(emoji);
}

function resolveWithReaction(msg, messageString, options, join, method, additionalArguments) {
  const reactEmojis = [];
  let commandList;
  if (options && options.length > 0) {
    commandList = language.handlers.emoji.labels.did_you_mean;
    for (let i = 0; i<options.length; i++) {
      const emoji = getGlobalDiscordEmoji(i);
      commandList += `\n${emoji} \`${options[i]}`;
      reactEmojis.push(emoji);
      if (join.length > 0) {
        commandList += ` ${join.join(' ')}`;
      }
      commandList += '`';
    }
  }

  const categories = [{
    title: language.general.message,
    text: messageString,
  }];
  if (commandList) {
    categories.push({
      title: language.handlers.emoji.labels.synonyms,
      text: commandList,
    });
    categories.push({
      title: language.general.usage,
      text: language.handlers.emoji.labels.usage,
    });
  }

  messageHandler.sendRichText(msg, language.general.error, categories).then((m) => {
    reactEmojis.forEach((e)=>m.react(e));
    return m;
  }).then((m) => {
    m.awaitReactions((react, user) => reactEmojis.includes(react.emoji.name) && user.id === msg.author.id,
        {max: 1, time: 60000, errors: ['time']}).then((collected) => {
      const reaction = collected.first();
      method(options[getNumberFromEmoji(reaction.emoji.name)], msg, additionalArguments);
    });
  });
}

export default {
  getCustomClientEmoji,
  getCustomGuildEmoji,
  getGlobalDiscordEmoji,
  getNumberFromEmoji,
  resolveWithReaction,
};
