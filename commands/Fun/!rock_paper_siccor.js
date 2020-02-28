import Command from '../command.js'
import msgHandler from '../../misc/messageHandler.js'


function GetAnswer() {
    return Math.floor((Math.random() * 4));
}


class Rock extends Command {
    constructor(category) {
        super(category);
        this.command = 'rock';
        this.usage = 'rock';
        this.permissions = [];
    }

    executeCommand(args, msg) {
        switch (GetAnswer()) {
            case 0:
                msgHandler.sendRichText(msg.channel, "Rock", [], undefined, 'rock.png').then(_=>msg.reply("TIE!"));
                break;
            case 1:
                msgHandler.sendRichText(msg.channel, "Paper", [], undefined, 'paper.png').then(_=>msg.reply("YOU LOOSE!"));
                break;
            case 2:
                msgHandler.sendRichText(msg.channel, "Scissor", [], undefined, 'scissors.png').then(_=>msg.reply("I WIN.. wait.. let us do that again!"));
                break;
            case 3:
                msgHandler.sendRichText(msg.channel, "SPOCK", [], undefined, 'spock.png').then(_=>msg.reply("I WIN! HAHAHA! UNBEATABLE!"));
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
        switch (GetAnswer()) {
            case 0:
                msgHandler.sendRichText(msg.channel, "Rock", [], undefined, 'rock.png').then(_=>msg.reply("I WIN.. wait.. let us do that again!"));
                break;
            case 1:
                msgHandler.sendRichText(msg.channel, "Paper", [], undefined, 'paper.png').then(_=>msg.reply("TIE!"));
                
                break;
            case 2:
                msgHandler.sendRichText(msg.channel, "Scissor", [], undefined, 'scissors.png').then(_=>msg.reply("YOU LOOSE!"));
                break;
            case 3:
                msgHandler.sendRichText(msg.channel, "SPOCK", [], undefined, 'spock.png').then(_=>msg.reply("I WIN! HAHAHA! UNBEATABLE!"));
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
        switch (GetAnswer()) {
            case 0:
                msgHandler.sendRichText(msg.channel, "Rock", [], undefined, 'rock.png').then(_=>msg.reply("YOU LOOSE!"));
                break;
            case 1:
                msgHandler.sendRichText(msg.channel, "Paper", [], undefined, 'paper.png').then(_=>msg.reply("I WIN.. wait.. let us do that again!"));
                break;
            case 2:
                msgHandler.sendRichText(msg.channel, "Scissor", [], undefined, 'scissors.png').then(_=>msg.reply("TIE!"));
                break;
            case 3:
                msgHandler.sendRichText(msg.channel, "SPOCK", [], undefined, 'spock.png').then(_=>msg.reply("I WIN! HAHAHA! UNBEATABLE!"));
        }
    }
}


const commands = [Rock, Paper, Scissor]
export {
    commands
};