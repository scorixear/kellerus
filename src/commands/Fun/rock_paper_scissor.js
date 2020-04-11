import Command from '../command.js';
import msgHandler from '../../misc/messageHandler.js';
import {dic as language, replaceArgs} from '../../misc/languageHandler.js';

const responses = language.commands.rock_paper_scissor.responses;

function getAnswer() {
  return Math.floor((Math.random() * 4));
}


class Rock extends Command {
  constructor(category) {
    super(category);
    this.command = 'rock';
    this.usage = 'rock';
    this.description = replaceArgs(language.commands.rock_paper_scissor.description,
        [language.commands.rock_paper_scissor.labels.rock]);
    this.example = 'rock';
    this.permissions = [];
  }
  /**
   * Executes the command
   * @param {Array<String>} args the arguments fo the msg
   * @param {Message} msg the msg object
   * @param {*} params added parameters and their argument
   */
  executeCommand(args, msg) {
    let answer;
    switch (getAnswer()) {
      case 0:
        answer = responses.tie[Math.floor(Math.random() * responses.tie.length)];
        msgHandler.sendRichText(msg, language.commands.rock_paper_scissor.labels.rock, [], undefined, 'rock.png')
            .then((_) => msg.reply(answer));
        break;
      case 1:
        answer = responses.win[Math.floor(Math.random() * responses.win.length)];
        msgHandler.sendRichText(msg, language.commands.rock_paper_scissor.labels.paper, [], undefined, 'paper.png')
            .then((_) => msg.reply(answer));
        break;
      case 2:
        answer = responses.loose[Math.floor(Math.random() * responses.loose.length)];
        msgHandler.sendRichText(msg, language.commands.rock_paper_scissor.labels.scissor, [], undefined, 'scissors.png')
            .then((_) => msg.reply(answer));
        break;
      case 3:
        answer = responses.spock[Math.floor(Math.random() * responses.spock.length)];
        msgHandler.sendRichText(msg, 'SPOCK', [], undefined, 'spock.png').then((_) => msg.reply(answer));
    }
  }
}

class Paper extends Command {
  constructor(category) {
    super(category);
    this.command = 'paper';
    this.description = replaceArgs(language.commands.rock_paper_scissor.description,
        [language.commands.rock_paper_scissor.labels.paper]);
    this.usage = 'paper';
    this.example = 'paper';
    this.permissions = [];
  }

  /**
   * Executes the command
   * @param {Array<String>} args the arguments fo the msg
   * @param {Message} msg the msg object
   * @param {*} params added parameters and their argument
   */
  executeCommand(args, msg) {
    let answer;
    switch (getAnswer()) {
      case 0:
        answer = responses.loose[Math.floor(Math.random() * responses.loose.length)];
        msgHandler.sendRichText(msg, language.commands.rock_paper_scissor.labels.rock, [], undefined, 'rock.png')
            .then((_) => msg.reply(answer));
        break;
      case 1:
        answer = responses.tie[Math.floor(Math.random() * responses.tie.length)];
        msgHandler.sendRichText(msg, language.commands.rock_paper_scissor.labels.paper, [], undefined, 'paper.png')
            .then((_) => msg.reply(answer));
        break;
      case 2:
        answer = responses.win[Math.floor(Math.random() * responses.win.length)];
        msgHandler.sendRichText(msg, language.commands.rock_paper_scissor.labels.scissor, [], undefined, 'scissors.png')
            .then((_) => msg.reply(answer));
        break;
      case 3:
        answer = responses.spock[Math.floor(Math.random() * responses.spock.length)];
        msgHandler.sendRichText(msg, 'SPOCK', [], undefined, 'spock.png').then((_) => msg.reply(answer));
    }
  }
}

class Scissor extends Command {
  constructor(category) {
    super(category);
    this.command = 'scissor';
    this.usage = 'scissor';
    this.description = replaceArgs(language.commands.rock_paper_scissor.description,
        [language.commands.rock_paper_scissor.labels.scissor]);
    this.example = 'scissor';
    this.permissions = [];
  }

  /**
   * Executes the command
   * @param {Array<String>} args the arguments fo the msg
   * @param {Message} msg the msg object
   * @param {*} params added parameters and their argument
   */
  executeCommand(args, msg) {
    let answer;
    switch (getAnswer()) {
      case 0:
        answer = responses.win[Math.floor(Math.random() * responses.win.length)];
        msgHandler.sendRichText(msg, language.commands.rock_paper_scissor.labels.rock, [], undefined, 'rock.png')
            .then((_) => msg.reply(answer));
        break;
      case 1:
        answer = responses.loose[Math.floor(Math.random() * responses.loose.length)];
        msgHandler.sendRichText(msg, language.commands.rock_paper_scissor.labels.paper, [], undefined, 'paper.png')
            .then((_) => msg.reply(answer));
        break;
      case 2:
        answer = responses.tie[Math.floor(Math.random() * responses.tie.length)];
        msgHandler.sendRichText(msg, language.commands.rock_paper_scissor.labels.scissor, [], undefined, 'scissors.png')
            .then((_) => msg.reply(answer));
        break;
      case 3:
        answer = responses.spock[Math.floor(Math.random() * responses.spock.length)];
        msgHandler.sendRichText(msg, 'SPOCK', [], undefined, 'spock.png').then((_) => msg.reply(answer));
    }
  }
}


const commands = [Rock, Paper, Scissor];
export {
  commands,
};
