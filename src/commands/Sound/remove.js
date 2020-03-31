import Command from './../command.js';
import permHandler from '../../misc/permissionHandler.js';
import config from '../../config';
import fs from 'fs';
import msgHandler from '../../misc/messageHandler';
import {dic as language, replaceArgs} from '../../misc/languageHandler.js';

/**
 * Removes a sound from the Discords Sound repertoire
 */
export default class Remove extends Command {
  constructor(category) {
    super(category);
    this.usage = `remove <${language.general.title}>`;
    this.command = 'remove';
    this.description = () => language.commands.remove.description;
    this.example = 'remove badumts';
  }
  /**
   * Executes the command
   * @param {Array<String>} args the arguments fo the msg
   * @param {Message} msg the msg object
   * @param {*} params added parameters and their argument
   */
  executeCommand(args, msg) {
    try {
      const {fileType, allowedChars} = config.commands.sound.add;
      const hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
      if (hasPermission === false) {
        return;
      }
      const title = args[0];

      if (title == null) {
        msgHandler.sendRichTextDefault({msg,
          title: language.general.error,
          description: replaceArgs(language.commands.add.error.title_invalid, [allowedChars]),
        });
        return;
      }

      const path = `./resources/soundeffects/${title}.${fileType}`;
      const exists = fs.existsSync(path);
      if (!exists) {
        msgHandler.sendRichTextDefault({msg,
          title: language.general.error,
          description: language.commands.remove.error.not_found,
        });
        return;
      }
      try {
        msgHandler.sendRichTextDefault({msg,
          title: language.commands.remove.labels.removed,
          description: replaceArgs(language.commands.remove.success, [title]),
        });
        return;
      } catch (err) {
        console.error(err);
        msgHandler.sendRichTextDefault({msg,
          title: language.general.error,
          description: language.commands.remove.error.file_deletion,
        });
        return;
      }
    } catch (err) {
      console.error(err);
      msgHandler.sendRichTextDefault({msg,
        title: language.general.error,
        description: language.commands.add.error.generic_error,
      });
    }
  }
}
