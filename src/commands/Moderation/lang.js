import messageHandler from '../../misc/messageHandler.js';
import fs from 'fs';
import Command from './../command.js';
import config from './../../config';
import {dic as language, changeLanguage, replaceArgs} from '../../misc/languageHandler.js';

export default class Lang extends Command {
  constructor(category) {
    super(category);
    this.usage = 'lang <list/language>';
    this.command = 'lang';
    this.description = language.commands.lang.description;
    this.example = 'lang en-EN';
    this.permissions = ['MANAGE_ROLES'];
  }

  executeCommand(args, msg) {
    try {
      super.executeCommand(args, msg);
    } catch (err) {
      return;
    }
    if (!args || args.length !== 1) {
      messageHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.error,
        description: language.error.invalid_usage,
        categories: [{
          title: language.general.usage,
          text: `\`${this.usage}\``,
        }],
      });
      return;
    }

    if (args[0] === 'list') {
      const files = fs.readdirSync('./src/assets/language');
      const list = '`'+files.reduce((p, c)=>p.replace('.json', '')+'`\n`'+c.replace('.json', ''))+'`';
      messageHandler.sendRichTextDefault({
        msg: msg,
        title: language.commands.lang.labels.list,
        description: list,
      });
      return;
    }

    if (!changeLanguage(args[0])) {
      const files = fs.readdirSync('./src/assets/language');
      const list = '`'+files.reduce((p, c)=>p.replace('.json', '')+'`\n`'+c.replace('.json', ''))+'`';
      messageHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.error,
        description: language.commands.lang.error.not_found,
        categories: [{
          title: language.commands.lang.labels.list,
          text: list,
        }],
      });
    } else {
      messageHandler.sendRichTextDefault({
        msg: msg,
        title: language.commands.lang.labels.success,
        description: replaceArgs(language.commands.lang.success, [args[0]]),
      });
    }
  }
}
