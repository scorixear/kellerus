/* eslint-disable no-unused-vars */
import Discord from 'discord.js';

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

function sendRichText(msg, title, categories, color, image, description, thumbnail, url) {
  return sendRichTextExplicit(msg.guild, msg.channel, msg.author,
      title, categories, color, image, description, thumbnail, url);
}

export default {
  sendRichText,
  sendRichText_Explicit: sendRichTextExplicit,
  sendRichText_Default: sendRichTextDefault,
};
