import Command from './../command.js';
import permHandler from '../../misc/permissionHandler.js';
export default class Cycle extends Command {

    constructor(category) {
        super(category);
        this.usage = 'cycle';
        this.command = 'cycle';
        this.description = 'Asks the bot, if he wants to play TheCycle!';
        this.example = 'cycle';
    }

    executeCommand(args, msg) {
        let hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
        if(hasPermission === false) {
            return;
        }
        msg.channel.send('Ja');
    }
}