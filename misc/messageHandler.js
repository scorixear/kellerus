import Discord from 'discord.js';


function sendRichText(channel, title, categories, color, author, description, thumbnail, image, footer, timestamp, url) {
    let richText = new Discord.RichEmbed()
        .setTitle(title);
    categories.forEach((category) => {
        if (category.title)
            richText.addField(category.title, category.text || '', category.inline || false);
        else
            richText.addBlankField(category.inline || false);
    })


    if (color)
        richText.setColor(color);
    if (author)
        richText.setAuthor(author);
    if (description)
        richText.setDescription(description);
    if (thumbnail)
        richText.setThumbnail(thumbnail);
    if (image)
        richText.setImage(image);
    if (footer)
        richText.setFooter(footer);
    if (timestamp)
        richText.setTimestamp(timestamp);
    if (url)
        richText.setURL(url);

    channel.send(richText);

}

export default {
    sendRichText
};