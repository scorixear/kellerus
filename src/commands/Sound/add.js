import Command from './../command.js';
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
    this.usage = `add <${language.general.title}> [--overwrite, --cat "<category>"] {${language.commands.add.labels.append_soundfile}.mp3}`;
    this.command = 'add';
    this.description = () => language.commands.add.description;
    this.example = 'add badumtsss ';
    this.permissions = ['ATTACH_FILES', 'SEND_TTS_MESSAGES', 'VIEW_AUDIT_LOG'];
  }
  /**
   * Executes the command
   * @param {Array<String>} args the arguments fo the msg
   * @param {Message} msg the msg object
   * @param {*} params added parameters and their argument
   */
  async executeCommand(args, msg, params) {
    try {
      const {fileType: allowedFileType, maxFileSize, allowedChars} = config.commands.sound.add;
      try {
        super.executeCommand(args, msg, params);
      } catch (err) {
        return;
      }
      const title = args[0].toLowerCase();
      const overwrite = params.overwrite;

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
      let path;
      if (params.cat&&params.cat !== '') {
        if (!fs.existsSync('./resources/soundeffects/'+params.cat)) {
          fs.mkdirSync('./resources/soundeffects/'+params.cat);
        }
        path = `./resources/soundeffects/${params.cat}/${title}.${fileType}`;
      } else {
        path = `./resources/soundeffects/${title}.${fileType}`;
      }
      const exists = fs.existsSync(path);
      if (exists && overwrite !== '') {
        msgHandler.sendRichTextDefault({msg,
          title: language.general.error,
          description: replaceArgs(language.commands.add.error.already_exists, [msg.content]),
        });
        return;
      }
      const added = await Add.download(url, path);
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
