import Command from './../command.js';

export default class Hi extends Command {

    constructor(category) {
        super(category);
        this.usage = 'hi';
        this.command = 'hi';
    }

    executeCommand(args, msg) {
        msg.reply('Hi Friend');
    }
}