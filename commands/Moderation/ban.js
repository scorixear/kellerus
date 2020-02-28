import Command from './../command.js';

export default class Ban extends Command {

    constructor(category) {
        super(category);
        this.usage = 'ban <user> [reason]';
        this.command = 'ban';
        this.permissions = ['BAN_MEMBERS'];
    }

    executeCommand(args, msg) {
        let hasPermission = Command.prototype.executeCommand.call(this, args, msg);
        if(hasPermission === false) {
            return;
        }
        throw new Error("not implemented");
    }
}