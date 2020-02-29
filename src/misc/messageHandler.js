import Discord from 'discord.js';


function sendRichText_Default({
    channel,
    title,
    categories,
    color,
    image,
    author,
    description,
    thumbnail,
    footer,
    timestamp,
    url
}) {
    return sendRichText(channel, title, categories, color, image, author, description, thumbnail, footer, timestamp, url);
}

function sendRichText(channel, title, categories, color, image, author, description, thumbnail, footer, timestamp, url) {
    let richText = new Discord.RichEmbed()
        .setTitle(title);
    if (categories) {
        categories.forEach((category) => {
            if (category.title)
                richText.addField(category.title, category.text || '', category.inline || false);
            else
                richText.addBlankField(category.inline || false);
        })
    }
    if (color)
        richText.setColor(color);
    if (author)
        richText.setAuthor(author);
    if (description)
        richText.setDescription(description);
    if (thumbnail)
        richText.setThumbnail(thumbnail);
    if (image) {
        richText.attachFile(`./src/assets/${image}`);
        richText.setImage(`attachment://${image}`);
    }

    if (footer)
        richText.setFooter(footer);
    if (timestamp)
        richText.setTimestamp(timestamp);
    if (url)
        richText.setURL(url);

    return channel.send(richText);
}

export default {
    sendRichText,
    sendRichText_Default
};