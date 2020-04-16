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
    this.description = () => language.commands.listSounds.description;
    this.example = 'listsounds';
    this.permissions = ['SEND_TTS_MESSAGES'];
  }
  /**
   * Executes the command
   * @param {Array<String>} args the arguments fo the msg
   * @param {Message} msg the msg object
   * @param {*} params added parameters and their argument
   */
  executeCommand(args, msg, params) {
    try {
      super.executeCommand(args, msg, params);
    } catch (err) {
      return;
    }
    try {
      const files = fs.readdirSync('./resources/soundeffects');
      if (files.length === 0) {
        msgHandler.sendRichTextDefault({msg,
          title: language.commands.listSounds.labels.no_sounds,
        });
        return;
      }
      const categories = [];
      const noCategory = ({
        title: language.commands.listSounds.labels.noCategory,
        text: '',
        inline: false,
      });
      let counter = 0;
      const {fileType} = config.commands.sound.add;
      files.sort();
      for (let i = 0; i < files.length; i += 1) {
        const f = files[i];
        if (f && f.endsWith('.'+fileType)) {
          counter++;
          const theCommand = (f.substr(0, f.length - 1 - fileType.length));
          noCategory.text += replaceArgs(language.commands.listSounds.labels.templateEntry, [(counter), theCommand]);
        } else {
          try {
            if (fs.lstatSync('./resources/soundeffects/'+f).isDirectory()) {
              const newCat = {
                title: f,
                text: '',
                inline: false,
              };
              const newFiles = fs.readdirSync('./resources/soundeffects/'+f+'/');
              newFiles.sort();
              let newCounter = 0;
              for (const newf of newFiles) {
                if (newf && newf.endsWith('.'+fileType)) {
                  newCounter++;
                  const theCommand = (newf.substr(0, newf.length - 1 - fileType.length));
                  newCat.text += replaceArgs(language.commands.listSounds.labels.templateEntry, [(newCounter), theCommand]);
                }
              }
              if (newCounter > 0) {
                categories.push(newCat);
              }
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
      categories.sort((a, b)=>a.title.localeCompare(b.title));
      if (counter != 0) {
        categories.unshift(noCategory);
      }
      msgHandler.sendRichTextDefault({msg,
        title: language.commands.listSounds.labels.header,
        categories: categories,
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
