import Command from './../command.js';

export default class Ping extends Command {

    constructor(category) {
        super(category);
        this.usage = 'ping';
        this.command = 'ping';
    }

    executeCommand(args, msg) {
        let hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
        if(hasPermission === false) {
            return;
        }
        throw new Error("not implemented");
    }
}