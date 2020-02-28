import Command from './../command.js';

export default class Ban extends Command {

    constructor(category) {
        super(category);
        this.usage = 'ban <user> [reason]';
        this.command = 'ban';
    }

    executeCommand(args, msg) {
        throw new Error("not implemented");
    }
}