import Command from './../command.js';
import config from '../../config.js';
import msgHandler from '../../misc/messageHandler.js';
import musicPlayer from '../../misc/musicPlayer.js';
import queueHandler from '../../misc/queueHandler';
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
   * @param {{name: string}} params added parameters and their argument
   */
  async executeCommand(args, msg, params) {
    try {
      super.executeCommand(args, msg, params);
    } catch (err) {
      return;
    }
    if (args && args.length > 0) {
      if (args[0] === 'clear' && args.length === 1) {
        this.clearQueue(msg, params);
        return;
      }
      if (args[0] === 'list' && args.length === 1) {
        await this.listQueue(msg, params);
        return;
      }
      if ((args[0] === 'listqueues' || args[0] === 'listq') && args.length === 1) {
        await this.listQueues(msg);
        return;
      }
      this.queueUp(msg, args, params);
      return;
    } else {
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.usage,
        description: replaceArgs(language.commands.queue.error.usage, [config.botPrefix, this.usage]),
        color: 0xCC0000,
      });
    }
  }

  /**
   * List queue titles
   * @param {Discord.Message} msg
   * @param {{name: string}} params
   */
  async listQueue(msg, params) {
    let name = config.default_queue;
    if (params && params.name && params.name.trim() !== '') {
      name = params.name.trim();
    }
    const queue = await queueHandler.addOrGetQueue(msg.guild.id, name);

    if (queue.length === 0) {
      const description = replaceArgs(language.commands.queue.success.empty_queue, [name]);
      if (name === config.default_queue) {
        description = language.commands.queue.success.empty_queue_default;
      }
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: 'Queue List',
        description: description,
      });
    } else {
      let queuelist = '';
      const server = localStorage.getServer(msg.guild.id);
      for (let i = 0; i < queue.length; i++) {
        if (i === server.queueIndex && server.queueName === name) {
          queuelist += `--> ${i+1}. \`${queue[i].title}\`\n`;
        } else {
          queuelist += `${i+1}. \`${queue[i].title}\`\n`;
        }
      }
      const title = replaceArgs(language.commands.queue.labels.list, [name]);
      if (name === config.default_queue) {
        title = language.commands.queue.labels.list_default;
      }
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: title,
        description: queuelist,
      });
    }

    return;
  }

  async listQueues(msg) {
    const queues = queueHandler.getQueues(msg.guild.id);
    let description;
    for (const queue of queues) {
      description += '- '+queue+'\n';
    }
    msgHandler.sendRichTextDefault({
      msg: msg,
      title: language.commands.queue.labels.queues,
      description: description,
    });
  }

  queueUp(msg, args, params) {
    let name = config.default_queue;
    let msgTitle = 'Queue';
    if (params && params.name && params.name.trim() !== '') {
      name = params.name.trim();
      msgTitle = 'Queue '+name;
    }
    if (args[0].startsWith('https://www.youtube.com/watch?v=')) {
      musicPlayer.getNameFromUrl(args[0], msg).then((title) => {
        this.addTitleToQueue(name, title, url, msg, msgTitle);
      }).catch((error)=> {
        if (err) {
          msgHandler.sendRichTextDefault({
            msg: msg,
            title: msgTitle,
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
    } else {
      musicPlayer.youtubeSearch(args).then(({title: title, url: url}) => {
        this.addTitleToQueue(name, title, url, msg, msgTitle);
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
  }

  addTitleToQueue(name, title, url, msg, msgTitle) {
    queueHandler.addTitle(name, title, url, msg.guild.id).then((success) => {
      if (success) {
        let description = replaceArgs(language.commands.queue.success.added_default, [title]);
        if (name===config.default_queue) {
          description = replaceArgs(language.commands.queue.success.added, [title, name]);
        }
        msgHandler.sendRichTextDefault({
          msg: msg,
          title: msgTitle,
          description: description,
        });
      } else {
        let description = replaceArgs(language.commands.queue.error.added_default, [title]);
        if (name===config.default_queue) {
          description = replaceArgs(language.commands.queue.error.added, [title, name]);
        }
        msgHandler.sendRichTextDefault({
          msg: msg,
          title: msgTitle,
          description: description,
        });
      }
    });
  }

  clearQueue(msg, params) {
    let name = config.default_queue;
    if (params && params.name && params.name.trim() !== '') {
      name = params.name.trim();
    }
    queueHandler.clearQueue(msg.guild.id, name).then((success) => {
      if (success) {
        let description = replaceArgs(language.commands.queue.success.clear, [name]);
        if (name === config.default_queue) {
          description = language.commands.queue.success.clear_default;
        }
        msgHandler.sendRichTextDefault({
          msg: msg,
          title: 'Queue',
          description: description,
        });
      } else {
        let description = replaceArgs(language.commands.queue.error.clear, [name]);
        if (name === config.default_queue) {
          description = language.commands.queue.error.clear_default;
        }
        msgHandler.sendRichTextDefault({
          msg: msg,
          title: 'Queue',
          description: description,
          color: 0xcc0000,
        });
      }
    });
    return;
  }
}
