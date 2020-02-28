import Command from './../command.js';
import permHandler from '../../misc/permissionHandler.js';

export default class Ban extends Command {

    constructor(category) {
        super(category);
        this.usage = 'ban <user> [reason]';
        this.command = 'ban';
        this.permissions = ['BAN_MEMBERS'];
    }

    executeCommand(args, msg) {
        let hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
        if(hasPermission === false) {
            return;
        }
        throw new Error("not implemented");
    }
}