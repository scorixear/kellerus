import {DMChannel, Guild, Message, TextBasedChannel, TextChannel, User, UserResolvable, CommandInteraction, Interaction, ButtonInteraction, ActionRowComponent, ActionRowBuilder, EmbedBuilder, ButtonBuilder, AttachmentBuilder, StageInstanceResolvable} from 'discord.js';

export default class MessageHandler {
  /**
   * Prints a MessageEmbed
   * @param param0
   */
  public static async sendRichTextDefault(param0 :{
    msg: Message,
    title?: string,
    categories?: {title: string, text?: string, inline?:boolean}[],
    color?: number,
    description?: string,
    thumbnail?: string,
    image?: string,
    url?: string,
    components?: ActionRowBuilder<ButtonBuilder>[],
  }) {
    return await this.sendRichText(param0.msg, param0.title, param0.categories, param0.color, param0.description, param0.thumbnail, param0.image, param0.url, param0.components);
  }

  /**
   * Prints a Message Embed
   */
  public static async sendRichTextDefaultExplicit(param0: {
    guild?: Guild,
    channel: TextBasedChannel,
    author?: User,
    title?: string,
    categories?: {title: string, text?: string, inline?: boolean}[],
    color?: number,
    description?: string,
    thumbnail?: string,
    image?: string,
    url?: string,
    components?: ActionRowBuilder<ButtonBuilder>[],
  }) {
    return await this.sendRichTextExplicit(param0.guild, param0.channel, param0.author, param0.title, param0.categories, param0.color, param0.description, param0.thumbnail, param0.image, param0.url, param0.components);
  }

  public static async replyRichErrorText(param0: {
    interaction: CommandInteraction | ButtonInteraction,
    title?: string,
    categories?: {title: string, text?: string, inline?: boolean}[],
    description?: string,
    thumbnail?: string,
    image?: string,
    color?: number,
    url?: string,
    components?: ActionRowBuilder<ButtonBuilder>[],
  }) {
    if(param0.interaction.deferred) {
      return await param0.interaction.editReply(await this.getRichErrorTextInteraction(param0));
    } else {
      return await param0.interaction.reply(await this.getRichErrorTextInteraction(param0));
    }
  }


  public static async replyRichText(param0: {
    interaction: CommandInteraction | ButtonInteraction,
    title?: string,
    categories?: {title: string, text?: string, inline?: boolean}[],
    description?: string,
    thumbnail?: string,
    image?: string,
    color?: number,
    url?: string,
    components?: ActionRowBuilder<ButtonBuilder>[],
    ephemeral?: boolean
  }) {
    if(param0.interaction.deferred) {
      return await param0.interaction.editReply(await this.getRichTextInteraction(param0));
    } else {
      return await param0.interaction.reply(await this.getRichTextInteraction(param0));
    }
  }

  public static async followUpRichText(param0: {
    interaction: CommandInteraction | ButtonInteraction,
    title?: string,
    categories?: {title: string, text?: string, inline?: boolean}[],
    description?: string,
    thumbnail?: string,
    image?: string,
    color?: number,
    url?: string,
    components?: ActionRowBuilder<ButtonBuilder>[],
    ephemeral?: boolean
  }) {
    if(param0.interaction.replied) {
      return await param0.interaction.followUp(await this.getRichTextInteraction(param0));
    } else if (param0.interaction.deferred) {
      return await param0.interaction.editReply(await this.getRichTextInteraction(param0));
    } else {
      return await param0.interaction.reply(await this.getRichTextInteraction(param0));
    }
  }

  /**
   * Prints a Message Embed
   * @param guild the Guild to print to
   * @param channel the channel to print to
   * @param author the author of the message
   * @param title the title
   * @param categories the fields
   * @param color hex rgb color
   * @param description
   * @param thumbnail thumbnail url string
   * @param url an url
   * @param buttons
   */
  public static async sendRichTextExplicit(guild: Guild | undefined, channel: TextBasedChannel, author: User | undefined, title: string | undefined, categories: {title: string, text?: string, inline?: boolean}[] | undefined, color: number | undefined, description: string | undefined, thumbnail: string | undefined, image: string | undefined, url: string | undefined, components: ActionRowBuilder<ButtonBuilder>[] | undefined) {
    channel.sendTyping();
    const richText: EmbedBuilder = new EmbedBuilder();
    if (title) {
      richText.setTitle(title);
    }

    if (categories) {
      richText.addFields(categories.map(category => {
        return  {name: category.title, value: category.text || '\u200b', inline: category.inline || false};
      }));
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
    let files: AttachmentBuilder[] = [];
    if(image) {
      files = [new AttachmentBuilder(`./src/assets/${image}`)];
      richText.setImage(`attachment://${image}`);
    }

    if (guild && author) {
      const guildMember = await guild.members.fetch(author);
      richText.setFooter({text: guildMember.nickname?guildMember.nickname.toString():guildMember.user.username.toString(), iconURL: author.avatarURL()??undefined});
    }

    richText.setTimestamp(new Date());
    if (url) {
      richText.setURL(url);
    }
    if (components) {
      return channel.send({embeds: [richText], components, files});
    }
    return channel.send({embeds: [richText], files});
  }

  public static async getRichTextInteraction(param0: {
    interaction: CommandInteraction | ButtonInteraction,
    title?: string,
    categories?: {title: string, text?: string, inline?: boolean}[],
    description?: string,
    thumbnail?: string,
    image?: string,
    color?: number,
    url?: string,
    components?: ActionRowBuilder<ButtonBuilder>[],
    ephemeral?: boolean
  }) {
    return this.getRichTextExplicitDefault({
      guild: param0.interaction.guild??undefined,
      author: param0.interaction.user,
      title: param0.title,
      categories: param0.categories,
      color: param0.color??0x00FF00,
      description: param0.description,
      thumbnail: param0.thumbnail,
      image: param0.image,
      url: param0.url,
      components: param0.components,
      ephemeral: param0.ephemeral
    });
  }

  public static async getRichErrorTextInteraction(param0: {
    interaction: CommandInteraction | ButtonInteraction,
    title?: string,
    categories?: {title: string, text?: string, inline?: boolean}[],
    description?: string,
    thumbnail?: string,
    image?: string,
    color?: number,
    url?: string,
    components?: ActionRowBuilder<ButtonBuilder>[],
  }) {
    return this.getRichTextExplicitDefault({
      guild: param0.interaction.guild??undefined,
      author: param0.interaction.user,
      title: param0.title,
      categories: param0.categories,
      color: param0.color??0xFF0000,
      description: param0.description,
      thumbnail: param0.thumbnail,
      image: param0.image,
      url: param0.url,
      components: param0.components,
      ephemeral: true
    });
  }


  /**
   * Returns a Message Embed
   */
  public static async getRichTextExplicitDefault(param0: {
    guild?: Guild,
    author?: User,
    title?: string,
    categories?: {title: string, text?: string, inline?: boolean}[],
    color?: number,
    description?: string,
    thumbnail?: string,
    image?: string,
    url?: string,
    components?: ActionRowBuilder<ButtonBuilder>[],
    ephemeral?: boolean,
  }) {
    return this.getRichTextExplicit(param0.guild, param0.author, param0.title, param0.categories, param0.color, param0.description, param0.thumbnail, param0.image, param0.url, param0.components, param0.ephemeral);
  }

  public static async getRichTextExplicit(guild?: Guild, author?: User, title?: string, categories?: {title: string, text?: string, inline?: boolean}[], color?: number, description?: string, thumbnail?: string, image?: string, url?: string, components?: ActionRowBuilder<ButtonBuilder>[], ephemeral?: boolean) {
    const richText: EmbedBuilder = new EmbedBuilder();
    if (title) {
      richText.setTitle(title);
    }

    if (categories) {
      richText.addFields(categories.map(category => {
        return  {name: category.title, value: category.text || '\u200b', inline: category.inline || false};
      }));
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
    let files: AttachmentBuilder[] = [];
    if(image) {
      files = [new AttachmentBuilder(`./src/assets/${image}`)];
      richText.setImage(`attachment://${image}`);
    }

    if (guild && author) {
      const guildMember = await guild.members.fetch(author);
      richText.setFooter({text: guildMember.nickname?guildMember.nickname.toString():guildMember.user.username.toString()??"", iconURL: author.avatarURL()??""});
    }

    richText.setTimestamp(new Date());
    if (url) {
      richText.setURL(url.toString());
    }
    const eph = ephemeral || false;

    let returnValue: {embeds: EmbedBuilder[], ephemeral: boolean, components?: ActionRowBuilder<ButtonBuilder>[], files: AttachmentBuilder[]} = {embeds: [richText], ephemeral: eph, files};

    if (components) {
      returnValue = {embeds: [richText], ephemeral: eph, components, files};
    }
    return returnValue;
  }

  /**
   * Prints a MessageEmbed
   * @param msg the message object to print from
   * @param title
   * @param categories the fields to add
   * @param color hex rgb number
   * @param image image path
   * @param description
   * @param thumbnail thumbnail url
   * @param url
   * @param buttons
   */
  public static async sendRichText(msg: Message, title: string | undefined, categories: {title: string, text?: string, inline?: boolean}[] | undefined, color: number | undefined, description: string | undefined, thumbnail: string | undefined, image: string | undefined, url: string | undefined, components: ActionRowBuilder<ButtonBuilder>[] | undefined) {
    return await this.sendRichTextExplicit(msg.guild??undefined, msg.channel, msg.author,
        title, categories, color, description, thumbnail, image, url, components);
  }

  public static splitInCategories(lines: string[], heading: string)
  {
    // Clone lines array
    const linesClone = lines.slice();
    // categories
    const categoryStrings: string[] = [''];
    // count total lines
    const lineCount = lines.length;
    // as long as we need to add lines
    while (linesClone.length > 0) {
      const currentString = categoryStrings[categoryStrings.length - 1];
      // if current category + this line is not too long
      if (currentString.length + linesClone[0].length + 1 < 1024) {
        categoryStrings[categoryStrings.length - 1] = currentString + linesClone.shift() + '\n';
      } else {
        // remove last newline character
        categoryStrings[categoryStrings.length - 1] = categoryStrings[categoryStrings.length - 1].slice(0,-1);
        // add new category
        categoryStrings.push(linesClone.shift() + '\n');
      }
    }
    categoryStrings[categoryStrings.length - 1] = categoryStrings[categoryStrings.length - 1].slice(0,-1)
    const categories = [
      {
        title: heading,
        text: categoryStrings[0],
        inline: true,
      }
    ];
    for (let i = 1; i < categoryStrings.length; i++) {
      categories.push({
        title: '\u200b',
        text: categoryStrings[i],
        inline: true,
      });
    }
    return categories;
  }
}
