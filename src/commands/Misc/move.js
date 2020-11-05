import msgHandler from '../../misc/messageHandler.js';
import config from '../../config.js';
import Command from './../command.js';
import {dic as language, replaceArgs} from '../../misc/languageHandler.js';
import discord from 'discord.js'

export default class Move extends Command {
  constructor(category) {
    super(category);
    this.usage = 'move #<channel>';
    this.command = 'move';
    this.description = () => language.commands.move.description;
    this.example = 'move Gaming';
    this.permissions = ['MOVE_MEMBERS'];
  }
  /**
   * Executes the command
   * @param {Array<String>} args the arguments fo the msg
   * @param {discord.Message} msg the msg object
   * @param {*} params added parameters and their argument
   */
  executeCommand(args, msg, params) {
    try {
      super.executeCommand(args, msg, params);
    } catch (err) {
      return;
    }
    let userstring = '';
    if (msg.member.voice.channel) {
      if(args.length > 0) {
        let regex = new RegExp("^[^a-zA-Z0-9]*"+args[0].toLowerCase()+"$");
        const moveChannel = msg.guild.channels.cache.find(c=> c.type === "voice" && regex.test(c.name.toLowerCase()));
        const users = msg.member.voice.channel.members;
        
        if(moveChannel) {
          users.forEach(user => {
            user.voice.setChannel(moveChannel);
            userstring += '<@' + user.id+'>\n';
          });
        }
        else {
          msgHandler.sendRichTextDefault({
            msg: msg,
            title: language.general.error,
            description: replaceArgs(language.commands.move.error.no_move_channel, [args[0]]),
            color: 0xcc0000,
          });
          return;
        }
      }
    } else {
       msgHandler.sendRichTextDefault({
            msg: msg,
            title: language.general.error,
            description: language.commands.move.error.no_channel,
            color: 0xcc0000,
          });
      return;
    }
    //console.log(userstring);
    msgHandler.sendRichTextDefault({
      	msg: msg,
        description: replaceArgs(language.commands.move.labels.success, [args[0], userstring]),
    });
  }
}
