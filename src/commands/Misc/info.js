import msgHandler from '../../misc/messageHandler.js';
import config from '../../config.js';
import Command from './../command.js';
import {dic as language} from '../../misc/languageHandler.js';

export default class Info extends Command {
  constructor(category) {
    super(category);
    this.usage = 'info';
    this.command = 'info';
    this.description = language.commands.info.description;
    this.example = 'info';
  }

  executeCommand(args, msg, params) {
    try {
      super.executeCommand(args, msg, params);
    } catch (err) {
      return;
    }
    const categories = [];
    categories[0] = {
      title: language.commands.info.labels.version,
      text: config.version,
      inline: true,
    };
    categories[1] = {
      title: language.commands.info.labels.repository,
      text: config.repo,
      inline: true,
    };
    categories[2] = {
      title: language.commands.info.labels.author,
      text: 'Paul Keller',
    };
    msgHandler.sendRichText(msg, 'Bot Info', categories, 0xF1C40F);
  }
}
