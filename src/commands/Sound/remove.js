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
    this.permissions = ['ATTACH_FILES', 'SEND_TTS_MESSAGES', 'VIEW_AUDIT_LOG'];
  }
  /**
   * Executes the command
   * @param {Array<String>} args the arguments fo the msg
   * @param {Message} msg the msg object
   * @param {*} params added parameters and their argument
   */
  executeCommand(args, msg, params) {
    try {
      const {fileType, allowedChars} = config.commands.sound.add;
      try {
        super.executeCommand(args, msg, params);
      } catch (err) {
        return;
      }
      const title = args[0].toLowerCase() + '.' + fileType;

      if (title == null) {
        msgHandler.sendRichTextDefault({msg,
          title: language.general.error,
          description: replaceArgs(language.commands.add.error.title_invalid, [allowedChars]),
        });
        return;
      }
      try {
        if (params.cat && params.cat !== '' && fs.existsSync('./resources/soundeffects/'+params.cat+'/'+title)) {
          fs.unlinkSync('./resources/soundeffects/'+params.cat+'/'+title);
          if (!fs.readdirSync('./resources/soundeffects/'+params.cat).length) {
            fs.rmdirSync('./resources/soundeffects/'+params.cat);
          }
          msgHandler.sendRichTextDefault({msg,
            title: language.commands.remove.labels.removed,
            description: replaceArgs(language.commands.remove.success, [args[0].toLowerCase()]),
          });
          return;
        } else if (fs.existsSync('./resources/soundeffects/'+title)) {
          fs.unlinkSync('./resources/soundeffects/'+title);
          msgHandler.sendRichTextDefault({msg,
            title: language.commands.remove.labels.removed,
            description: replaceArgs(language.commands.remove.success, [args[0].toLowerCase()]),
          });
          return;
        } else {
          const folders = fs.readdirSync('./resources/soundeffects/').filter( (x)=>fs.lstatSync('./resources/soundeffects/'+x).isDirectory());
          for (const folder of folders) {
            if (fs.existsSync('./resources/soundeffects/'+folder+'/'+title)) {
              fs.unlinkSync('./resources/soundeffects/'+folder+'/'+title);
              if (!fs.readdirSync('./resources/soundeffects/'+folder).length) {
                fs.rmdirSync('./resources/soundeffects/'+folder);
              }
              msgHandler.sendRichTextDefault({msg,
                title: language.commands.remove.labels.removed,
                description: replaceArgs(language.commands.remove.success, [args[0].toLowerCase()]),
              });
              return;
            }
          }
        }
        msgHandler.sendRichTextDefault({msg,
          title: language.general.error,
          description: language.commands.remove.error.not_found,
        });
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
