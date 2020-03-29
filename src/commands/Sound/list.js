import Command from './../command.js';
import config from '../../config';
import fs from 'fs';
import msgHandler from '../../misc/messageHandler';
import {dic as language, replaceArgs} from '../../misc/languageHandler.js';

/**
 * Adds a sound to the Discords Sound repertoire
 */
export default class ListSounds extends Command {
  constructor(category) {
    super(category);
    this.usage = `listsounds`;
    this.command = 'listsounds';
    this.description = language.commands.listSounds.description;
    this.example = 'listsounds';
  }

  async executeCommand(args, msg) {
    try {
      super.executeCommand(args, msg);
    } catch (err) {
      return;
    }
    try {
      const files = fs.readdirSync('./resources/soundeffects');
      if(files.length === 0) {
        msgHandler.sendRichTextDefault({msg,
          title: language.commands.listSounds.labels.no_sounds,
        });
        return;
      }
      let commandList = '';
      let counter = 0;
      const {fileType} = config.commands.sound.add;
      for(let i = 0; i < files.length; i += 1) {
        const f = files[i];
        if(f && f.endsWith(fileType)) {
          counter += 1;
          const theCommand = (f.substr(0, f.length - 1 - fileType.length));
          commandList+= replaceArgs(language.commands.listSounds.labels.templateEntry, [(counter), theCommand]);
        }
      }
      msgHandler.sendRichTextDefault({msg,
        title: language.commands.listSounds.labels.header,
        description: commandList,
      });
    } catch (err) {
      console.log(err);
      msgHandler.sendRichTextDefault({msg,
        title: language.general.error,
        description: language.commands.add.error.generic_error,
      });
    }
  }
}
