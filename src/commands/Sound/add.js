import Command from './../command.js';
import permHandler from '../../misc/permissionHandler.js';
import https from 'https';
import config from '../../config';
import fs from 'fs';
import msgHandler from '../../misc/messageHandler';
import {dic as language, replaceArgs} from '../../misc/languageHandler.js';

/**
 * Adds a sound to the Discords Sound repertoire
 */
export default class Add extends Command {
  constructor(category) {
    super(category);
    this.usage = `add <${language.general.title}> {${language.commands.add.labels.append_soundfile}.mp3}`;
    this.command = 'add';
    this.description = language.commands.add.description;
    this.example = 'add badumtsss ';
  }

  async executeCommand(args, msg) {
    try {
      const {fileType: allowedFileType, maxFileSize, allowedChars} = config.commands.sound.add;
      const hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
      if (hasPermission === false) {
        return;
      }
      const title = args[0];
      const overwrite = args[1];

      if (title == null || title.length < 3 || title.length > 20) {
        msgHandler.sendRichTextDefault({msg,
          title: language.general.error,
          description: replaceArgs(language.commands.add.error.title_invalid, [allowedChars]),
        });
        return;
      }

      // check if any attachment exists
      const attachment = msg.attachments.first();
      if (attachment == null) {
        msgHandler.sendRichTextDefault({msg,
          title: language.general.error,
          description: language.commands.add.error.no_attachment,
        });
        return;
      }

      const {url, size, name} = attachment;
      if (size > maxFileSize) {
        msgHandler.sendRichTextDefault({msg,
          title: language.general.error,
          description: language.commands.add.error.file_size,
        });
        return;
      }
      const fileType = name.split('.')[1];
      if (!(allowedFileType === fileType)) {
        msgHandler.sendRichTextDefault({msg,
          title: language.general.error,
          description: language.commands.add.error.invalid_format,
        });
        return;
      }
      const path = `./resources/soundeffects/${title}.${fileType}`;
      const exists = fs.existsSync(path);
      if (exists && overwrite !== 'overwrite') {
        msgHandler.sendRichTextDefault({msg,
          title: language.general.error,
          description: replaceArgs(language.commands.add.error.already_exists, [config.botPrefix, this.command, title]),
        });
        return;
      }
      const added = await Add.download(url, path);
      console.log(added);
      if (added) {
        msgHandler.sendRichTextDefault({msg,
          title: language.commands.add.labels.command_added,
          description: replaceArgs(language.commands.add.success, [title]),
        });
        return;
      } else {
        msgHandler.sendRichTextDefault({msg,
          title: language.general.error,
          description: language.commands.add.error.file_saving,
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


  static download(url, dest, cb) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest);
      https.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
          file.close();
          resolve(true); // close() is async, call cb after close completes.
        });
      }).on('error', function(err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        resolve(false);
      });
    });
  };
}
