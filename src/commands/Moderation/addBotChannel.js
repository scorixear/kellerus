import Command from './../command.js';
import {dic as language, replaceArgs} from './../../misc/languageHandler.js';
import messageHandler from '../../misc/messageHandler';
import discordHandler from '../../misc/discordHandler';
import sqlHandler from '../../misc/sqlHandler';

export default class AddBotChannel extends Command {
  constructor(category) {
    super(category);
    this.usage = 'addChannel <#channel-name> <channel-names>';
    this.command = 'addChannel';
    this.description = () => language.commands.addBotChannel.description;
    this.example = 'addChannel #general general-$';
    this.permissions = ["MANAGE_CHANNELS"];
  }
  /**
   * Executes the command
   * @param {Array<String>} args the arguments fo the msg
   * @param {Message} msg the msg object
   * @param {*} params added parameters and their argument
   */
  async executeCommand(args, msg, params) {
    try {
      super.executeCommand(args, msg, params);
    } catch (err) {
      return;
    }

    if(!args || args.length !== 2) {
      messageHandler.sendRichTextDefault({
        msg: msg,
        title: language.commands.addBotChannel.usageTitle,
        description: this.usage,
        color: 0xcc0000
      });
      return;
    }

    const channel = discordHandler.client.channels.cache.get(args[0]);
    if(channel.isText()) {
      messageHandler.sendRichTextDefault({
        msg: msg,
        title: language.commands.addBotChannel.error.textTitle,
        description: language.commands.addBotChannel.error.textDescription,
        color: 0xcc0000
      });
      return;
    }
    if(!channel || !args[1].includes('$')) {
      messageHandler.sendRichTextDefault({
        msg: msg,
        title: language.commands.addBotChannel.error.usageTitle,
        description: this.usage,
        color: 0xcc0000
      });
      return;
    }

    if(!await sqlHandler.saveChannel(channel.id, args[1])) {
      messageHandler.sendRichTextDefault({
        msg: msg,
        title: language.commands.addBotChannel.error.sqlTitle,
        description: language.commands.addBotChannel.error.sqlDescription,
        color: 0xcc0000
      });
      return;
    }

    messageHandler.sendRichTextDefault({
      msg: msg,
      title: language.commands.addBotChannel.labels.success,
      description: replaceArgs(language.commands.addBotChannel.labels.description, [channel.name, args[1]])
    });
  }

  getChannelFromMention(mention) {
    if(!mention) return;
    if(mention.startsWith('<#') && mention.endsWith('>')) {
      mention = mention.slice(2, -1);
      if(mention.startsWith('!')) {
        mention = mention.slice(1);
      }

      return discordHandler.client.channels.cache.get(mention);
    }
  }
}
