import Command from './../command.js';
import permHandler from '../../misc/permissionHandler.js';

export default class Hi extends Command {

    constructor(category) {
        super(category);
        this.usage = 'hi';
        this.command = 'hi';
    }

    executeCommand(args, msg) {
        console.log(permHandler);
        let hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
        if(hasPermission === false) {
            return;
        }
        msg.reply('Hi Friend');
    }
}