import Command from './../command.js';

export default class Ping extends Command {

    constructor(category) {
        super(category);
        this.usage = 'ping';
        this.command = 'ping';
    }

    executeCommand(args, msg) {
        throw new Error("not implemented");
    }
}