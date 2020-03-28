import discordHandler from './discordHandler';
function getCustomGuildEmoji(name, guild) {
  if (!isNaN(name)) {
    name = findNumber(name);
  }
  return guild.emojis.cache.find((emoji) => {
    return emoji.name === name;
  });
}

function getCustomClientEmoji(name) {
  if (!isNaN(name)) {
    name = findNumber(name);
  }
  return discordHandler.client.emojis.cache.find((emoji) => {
    return emoji.name === name;
  });
}

function getGlobalDiscordEmoji(name) {
  switch (name) {
    case '0':
      return '0️⃣';
    case '1':
      return '1️⃣';
    case '2':
      return '2️⃣';
    case '3':
      return '3️⃣';
    case '4':
      return '4️⃣';
    case '5':
      return '5️⃣';
    case '6':
      return '6️⃣';
    case '7':
      return '7️⃣';
    case '8':
      return '8️⃣';
    case '9':
      return '9️⃣';
  }
}

function getNumberFromEmoji(emoji) {
  switch (emoji) {
    case '0️⃣':
      return 0;
    case '1️⃣':
      return 1;
    case '2️⃣':
      return 2;
    case '3️⃣':
      return 3;
    case '4️⃣':
      return 4;
    case '5️⃣':
      return 5;
    case '6️⃣':
      return 6;
    case '7️⃣':
      return 7;
    case '8️⃣':
      return 8;
    case '9️⃣':
      return 9;
  }
}

function findNumber(number) {
  switch (number) {
    case 0:
      return 'zero';
    case 1:
      return 'one';
    case 2:
      return 'two';
    case 3:
      return 'three';
    case 4:
      return 'four';
    case 5:
      return 'five';
    case 6:
      return 'six';
    case 7:
      return 'seven';
    case 8:
      return 'eight';
    case 9:
      return 'nine';
  }
}
export default {
  getCustomClientEmoji,
  getCustomGuildEmoji,
  getGlobalDiscordEmoji,
  getNumberFromEmoji,
};
