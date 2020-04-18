/* eslint-disable no-unused-vars */
import Discord from 'discord.js';

/**
 * Prints a MessageEmbed
 * @param {{msg: Discord.Message, title: string, categories: Array<{title: string, text: string, inline: boolean}>, color: number, image: string, description: string, thumbnail: string, url: string}} param0
 * @return {Promise<(Discord.Message|Array<Discord.Message>)>}
 */
function sendRichTextDefault({
  msg,
  title,
  categories,
  color,
  image,
  description,
  thumbnail,
  url,
}) {
  return sendRichText(msg, title, categories, color, image, description, thumbnail, url);
}

/**
 * Prints a Message Embed
 * @param {{guild: Discord.Guild, channel: Discord.Channel, title: string, categories: Array<{title: string, text: string, inline: boolean}>, color: number, image: string, description: string, thumbnail: string, url: string}} param0
 * @return {Promise<(Discord.Message|Array<Discord.Message>)>}
 */
function sendRichTextDefaultExplicit({
  guild,
  channel,
  author,
  title,
  categories,
  color,
  image,
  description,
  thumbnail,
  url,
}) {
  return sendRichTextExplicit(guild, channel, author, title, categories, color, image, description, thumbnail, url);
}

/**
 * Prints a Message Embed
 * @param {Discord.Guild} guild the Guild to print to
 * @param {Discord.Channel} channel the channel to print to
 * @param {Discord.UserResolvable} author the author of the message
 * @param {string} title the title
 * @param {Array<{title: string, test: string, inline: boolean}>} categories the fields
 * @param {number} color hex rgb color
 * @param {string} image an image path
 * @param {string} description
 * @param {string} thumbnail thumbnail url string
 * @param {string} url an url
 * @return {Promise<(Discord.Message|Array<Discord.Message>)>}
 */
function sendRichTextExplicit(guild, channel, author, title, categories, color, image, description, thumbnail, url) {
  const richText = new Discord.MessageEmbed();
  if (title) {
    richText.setTitle(title);
  }

  if (categories) {
    categories.forEach((category) => {
      if (category.title) {
        richText.addField(category.title, category.text || '', category.inline || false);
      } else {
        richText.addBlankField(category.inline || false);
      }
    });
  }
  if (color) {
    richText.setColor(color);
  }
  if (description) {
    richText.setDescription(description);
  }
  if (thumbnail) {
    richText.setThumbnail(thumbnail);
  }
  if (image) {
    richText.attachFiles([`./src/assets/${image}`]);
    richText.setImage(`attachment://${image}`);
  }

  if (guild && author) {
    richText.setFooter(guild.member(author).nickname, author.avatarURL());
  }

  richText.setTimestamp(new Date());
  if (url) {
    richText.setURL(url);
  }

  return channel.send(richText);
}

/**
 * Prints a MessageEmbed
 * @param {Discord.Message} msg the message object to print from
 * @param {string} title
 * @param {{title: string, text: string, inline: boolean}} categories the fields to add
 * @param {number} color hex rgb number
 * @param {string} image image path
 * @param {string} description
 * @param {string} thumbnail thumbnail url
 * @param {url} url
 * @return {Promise<(Discord.Message|Array<Discord.Message>)>}
 */
function sendRichText(msg, title, categories, color, image, description, thumbnail, url) {
  return sendRichTextExplicit(msg.guild, msg.channel, msg.author,
      title, categories, color, image, description, thumbnail, url);
}

export default {
  sendRichText,
  sendRichTextExplicit,
  sendRichTextDefault,
  sendRichTextDefaultExplicit,
};
