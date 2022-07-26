import Command from './../command.js';
import {dic as language, replaceArgs} from './../../misc/languageHandler.js';
import messageHandler from '../../misc/messageHandler';
import discordHandler from '../../misc/discordHandler';
import sqlHandler from '../../misc/sqlHandler';

export default class RemoveBotChannel extends Command {
  constructor(category) {
    super(category);
    this.usage = 'removeChannel <#channel-name>';
    this.command = 'removeChannel';
    this.description = () => language.commands.addBotChannel.description;
    this.example = 'removeChannel #general';
    this.permissions = ['MANAGE_CHANNELS'];
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

    if (!args || args.length !== 1) {
      messageHandler.sendRichTextDefault({
        msg: msg,
        title: language.commands.removeBotChannel.usageTitle,
        description: this.usage,
        color: 0xcc0000,
      });
      return;
    }

    const channel = discordHandler.client.channels.cache.get(args[0]);
    if (!channel) {
      messageHandler.sendRichTextDefault({
        msg: msg,
        title: language.commands.removeBotChannel.usageTitle,
        description: this.usage,
        color: 0xcc0000,
      });
      return;
    }

    if (!await sqlHandler.removeChannel(channel.id)) {
      messageHandler.sendRichTextDefault({
        msg: msg,
        title: language.commands.removeBotChannel.sqlError,
        description: language.commands.removeBotChannel.sqlErrorDescription,
        color: 0xcc0000,
      });
      return;
    }

    messageHandler.sendRichTextDefault({
      msg: msg,
      title: language.commands.removeBotChannel.labels.success,
      description: replaceArgs(language.commands.removeBotChannel.labels.description, [channel.name]),
    });
  }

  getChannelFromMention(mention) {
    if (!mention) return;
    if (mention.startsWith('<#') && mention.endsWith('>')) {
      mention = mention.slice(2, -1);
      if (mention.startsWith('!')) {
        mention = mention.slice(1);
      }
      console.log(mention);

      return discordHandler.client.channels.cache.get(mention);
    }
  }
}
