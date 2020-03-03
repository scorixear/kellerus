import Command from '../command.js'
import msgHandler from '../../misc/messageHandler.js'
import fs from 'fs';

const responses = JSON.parse(fs.readFileSync('./src/commands/Fun/rps_response.json'));

function GetAnswer() {
    return Math.floor((Math.random() * 4));
}


class Rock extends Command {
    constructor(category) {
        super(category);
        this.command = 'rock';
        this.usage = 'rock';
        this.description = 'Plays `rock` against the bot.';
        this.example = 'rock'
        this.permissions = [];
    }

    executeCommand(args, msg) {
        let answer;
        switch (GetAnswer()) {
            case 0:
                answer  = responses.tie[Math.floor(Math.random()*responses.tie.length)];
                msgHandler.sendRichText(msg.channel, 'Rock', [], undefined, 'rock.png').then(_=>msg.reply(answer));
                break;
            case 1:
                answer  = responses.win[Math.floor(Math.random()*responses.win.length)];
                msgHandler.sendRichText(msg.channel, 'Paper', [], undefined, 'paper.png').then(_=>msg.reply(answer));
                break;
            case 2:
                answer  = responses.loose[Math.floor(Math.random()*responses.loose.length)];
                msgHandler.sendRichText(msg.channel, 'Scissor', [], undefined, 'scissors.png').then(_=>msg.reply(answer));
                break;
            case 3:
                answer  = responses.spock[Math.floor(Math.random()*responses.spock.length)];
                msgHandler.sendRichText(msg.channel, 'SPOCK', [], undefined, 'spock.png').then(_=>msg.reply(answer));
        }
    }
}

class Paper extends Command {
    constructor(category) {
        super(category);
        this.command = 'paper';
        this.usage = 'paper';
        this.permissions = [];
    }

    executeCommand(args, msg) {
        let answer;
        switch (GetAnswer()) {
            case 0:
                answer  = responses.loose[Math.floor(Math.random()*responses.loose.length)];
                msgHandler.sendRichText(msg.channel, 'Rock', [], undefined, 'rock.png').then(_=>msg.reply(answer));
                break;
            case 1:
                answer  = responses.tie[Math.floor(Math.random()*responses.tie.length)];
                msgHandler.sendRichText(msg.channel, 'Paper', [], undefined, 'paper.png').then(_=>msg.reply(answer));
                break;
            case 2:
                answer  = responses.win[Math.floor(Math.random()*responses.win.length)];
                msgHandler.sendRichText(msg.channel, 'Scissor', [], undefined, 'scissors.png').then(_=>msg.reply(answer));
                break;
            case 3:
                answer  = responses.spock[Math.floor(Math.random()*responses.spock.length)];
                msgHandler.sendRichText(msg.channel, 'SPOCK', [], undefined, 'spock.png').then(_=>msg.reply(answer));
        }
    }
}

class Scissor extends Command {
    constructor(category) {
        super(category);
        this.command = 'scissor';
        this.usage = 'scissor';
        this.permissions = [];
    }

    executeCommand(args, msg) {
        let answer;
        switch (GetAnswer()) {
            case 0:
                answer  = responses.win[Math.floor(Math.random()*responses.win.length)];
                msgHandler.sendRichText(msg.channel, 'Rock', [], undefined, 'rock.png').then(_=>msg.reply(answer));
                break;
            case 1:
                answer  = responses.loose[Math.floor(Math.random()*responses.loose.length)];
                msgHandler.sendRichText(msg.channel, 'Paper', [], undefined, 'paper.png').then(_=>msg.reply(answer));
                break;
            case 2:
                answer  = responses.tie[Math.floor(Math.random()*responses.tie.length)];
                msgHandler.sendRichText(msg.channel, 'Scissor', [], undefined, 'scissors.png').then(_=>msg.reply(answer));
                break;
            case 3:
                answer  = responses.spock[Math.floor(Math.random()*responses.spock.length)];
                msgHandler.sendRichText(msg.channel, 'SPOCK', [], undefined, 'spock.png').then(_=>msg.reply(answer));
        }
    }
}


const commands = [Rock, Paper, Scissor]
export {
    commands
};