import Command from './../command.js';
import config from '../../config.js';
import msgHandler from '../../misc/messageHandler.js';
import musicPlayer from '../../misc/musicPlayer.js';
import sqlHandler from '../../misc/sqlHandler.js';
// eslint-disable-next-line no-unused-vars
import Discord from 'discord.js';
import {dic as language, replaceArgs} from '../../misc/languageHandler.js';
import localStorage from '../../misc/localStorage.js';

export default class Queue extends Command {
  constructor(category) {
    super(category);
    this.usage = 'queue <clear/list/link/search params>';
    this.command = 'queue';
    this.permissions = ['MOVE_MEMBERS'];
    this.description = () => language.commands.queue.description;
    this.example = language.commands.queue.example;
  }
  /**
   * Executes the command
   * @param {Array<String>} args the arguments fo the msg
   * @param {Discord.Message} msg the msg object
   * @param {{}} params added parameters and their argument
   */
  async executeCommand(args, msg, params) {
    try {
      super.executeCommand(args, msg, params);
    } catch (err) {
      return;
    }


    if (args && args.length > 0) {
      if (args[0] === 'clear' && args.length === 1) {
        sqlHandler.clearQueue(msg.guild.id).then((success) => {
          if (success) {
            msgHandler.sendRichTextDefault({
              msg: msg,
              title: 'Queue',
              description: language.commands.queue.success.clear,
            });
          } else {
            msgHandler.sendRichTextDefault({
              msg: msg,
              title: 'Queue',
              description: language.commands.queue.error.clear,
              color: 0xcc0000,
            });
          }
        });
        return;
      }
      if (args[0] === 'list' && args.length === 1) {
        const queue = await musicPlayer.updateQueue(msg.guild.id);
        if (queue.length === 0) {
          msgHandler.sendRichTextDefault({
            msg: msg,
            title: 'Queue List',
            description: language.commands.queue.success.empty_queue,
          });
        } else {
          let queuelist = '';
          const server = localStorage.getServer(msg.guild.id);
          for (let i = 0; i < queue.length; i++) {
            if (i === server.queueIndex) {
              queuelist += `--> \`${queue[i].title}\`\n`;
            } else {
              queuelist += `- \`${queue[i].title}\`\n`;
            }
          }
          msgHandler.sendRichTextDefault({
            msg: msg,
            title: language.commands.queue.labels.list,
            description: queuelist,
          });
        }

        return;
      }
      if (args[0].startsWith('https://www.youtube.com/watch?v=')) {
        sqlHandler.addQueue(args[0], args[0], msg.guild.id).then((success) => {
          if (success) {
            msgHandler.sendRichTextDefault({
              msg: msg,
              title: 'Queue',
              description: replaceArgs(language.commands.queue.success.added, [args[0]]),
            });
          } else {
            msgHandler.sendRichTextDefault({
              msg: msg,
              title: 'Queue',
              description: replaceArgs(language.commands.queue.error.added, [args[0]]),
            });
          }
        });
      } else {
        musicPlayer.youtubeSearch(args, msg).then((title) => {
          if (title.startsWith('$$$$ignore')) {
            msgHandler.sendRichTextDefault({
              msg: msg,
              title: 'Queue',
              description: replaceArgs(language.commands.queue.error.added, [title.substring(10)]),
            });
          } else {
            msgHandler.sendRichTextDefault({
              msg: msg,
              title: 'Queue',
              description: replaceArgs(language.commands.queue.success.added, [title]),
            });
          }
        }).catch((err) => {
          if (err) {
            msgHandler.sendRichTextDefault({
              msg: msg,
              title: 'Queue',
              description: language.commands.queue.error.no_results,
              color: 0xCC0000,
            });
          } else {
            msgHandler.sendRichTextDefault({
              msg: msg,
              title: language.general.error,
              description: language.commands.queue.error.unknown_error,
              color: 0xCC0000,
            });
          }
        });
      }
    } else {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.usage,
        description: replaceArgs(language.commands.queue.error.usage, [config.botPrefix, this.usage]),
        color: 0xCC0000,
      });
    }
  }
}
