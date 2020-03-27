import Command from './../command.js';
import permHandler from '../../misc/permissionHandler.js';
import basedir from '../../../basedir';
const https = require('https');
const config = require('../../config');
const fs = require('fs');
import {downloadFromInfo} from 'ytdl-core';
import msgHandler from '../../misc/messageHandler';

/**
 * Removes a sound from the Discords Sound repertoire
 */
export default class Remove extends Command {
  constructor(category) {
    super(category);
    this.usage = `remove < title>`;
    this.command = 'remove';
    this.description = 'Removes a SoundFile';
    this.example = 'remove badumts';
  }

  async executeCommand(args, msg) {
    try {
      const {fileType} = config.commands.sound.add;
      const hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
      if (hasPermission === false) {
        return;
      }
      const title = args[0];

      if (title == null) {
        msgHandler.sendRichTextDefault({msg,
          title: 'Crap 😕',
          description: '`Title invalid`\n' +
          'Gimme gimme gimme a title. Anything between three and twenty characters\n' +
          `Must match this regex \`${allowedChars}\``});
        return;
      }

      const path = basedir+'/resources/soundeffects/'+title+fileType;
      const exists = await fs.existsSync(path);
      if (!exists) {
        msgHandler.sendRichTextDefault({msg,
          title: 'Crap 😕',
          description: `\`Command doesn't exists\``,
        });
        return;
      }
      try {
        msgHandler.sendRichTextDefault({msg,
          title: 'Removed 💥',
          description: `Command \`${title}\` removed`,
        });
        return;
      } catch (err) {
        console.error(err);
        msgHandler.sendRichTextDefault({msg,
          title: 'Crap 😕',
          description: `\`Deletion failed\`\n
          Something bad happened while deleting command. PAUUUUUL, helpppp!`,
        });
        return;
      }
    } catch (err) {
      console.error(err);
      msgHandler.sendRichTextDefault({msg,
        title: 'Crap 😕',
        description: '`Unexpected Error`\n' +
        'Luca expected every possible error. But you ... you managed to find another one',
      });
    }
  }
}
