import Command from './../command.js';
import permHandler from '../../misc/permissionHandler.js';
import basedir from '../../../basedir';
const https = require('https');
const config = require('../../config');
const fs = require('fs');
import {downloadFromInfo} from 'ytdl-core';
import msgHandler from '../../misc/messageHandler';

/**
 * Adds a sound to the Discords Sound repertoire
 */
export default class Add extends Command {
  constructor(category) {
    super(category);
    this.usage = `add < title> < SoundFile.mp3>`;
    this.command = 'add';
    this.description = 'Stores a SoundFile';
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
        msgHandler.sendRichText_Default({msg,
          title: 'Crap 😕',
          description: '`Title invalid`\n'+
          'Gimme gimme gimme a title. Anything between three and twenty characters\n'+
          `Must match this regex \`${allowedChars}\``});
        return;
      }

      // check if any attachment exists
      const attachment = msg.attachments.first();
      if (attachment == null) {
        msgHandler.sendRichText_Default({msg,
          title: 'Crap 😕',
          description: `\`No attachment found\`\nYou're not a Jedi, attachments are not forbidden`});
        return;
      }

      const {url, size, name} = attachment;
      if (size > maxFileSize) {
        msgHandler.sendRichText_Default({msg,
          title: 'Crap 😕',
          description: `\`Filesize exceeds maximum\`\nQuoting a famous actress: "It's too big 😲"`});
        return;
      }
      const fileType = '.'+name.split('.')[1];
      if (!(allowedFileType === fileType)) {
        msgHandler.sendRichText_Default({msg,
          title: 'Crap 😕',
          description: `\`File is not in mp3 format\`\nmp4 and mp5 are forbidden, too`});
        return;
      }
      const path = basedir+'/resources/soundeffects/'+title+fileType;
      const exists = await fs.existsSync(path);
      if (exists && overwrite !== 'overwrite') {
        msgHandler.sendRichText_Default({msg,
          title: 'Crap 😕',
          description: '`This command already exists`\n'+
          'Try to save it under another command, '+
          `or overwrite this command using \`${config.prefix}${this.command} ${title} overwrite\``,
        });
        return;
      }
      const added = await Add.download(url, path);
      console.log(added);
      if (added) {
        msgHandler.sendRichText_Default({msg,
          title: 'Command Added 🎉🎉',
          description: `Command \`${title}\` added :D`,
        });
        return;
      } else {
        msgHandler.sendRichText_Default({msg,
          title: 'Crap 💥',
          description: `Something went wrong :/`,
        });
        return;
      }
    } catch (err) {
      msgHandler.sendRichText_Default({msg,
        title: 'Crap 😕',
        description: '`Unexpected Error`'+
        '\nLuca expected every possible error. But you ... you managed to find another one',
      });
    }
  }


  static download(url, dest, cb) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest);
      https.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
          file.close().then(() => {
            resolve(true);
          }); // close() is async, call cb after close completes.
        });
      }).on('error', function(err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        resolve(false);
      });
    });
  };
}
