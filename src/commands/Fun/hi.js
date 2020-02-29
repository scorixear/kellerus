import Command from './../command.js';
import permHandler from '../../misc/permissionHandler.js';
import fs from 'fs';

export default class Hi extends Command {

    constructor(category) {
        super(category);
        this.usage = 'hi';
        this.command = 'hi';
    }

    executeCommand(args, msg) {
        let hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
        if(hasPermission === false) {
            return;
        }
        let replys = JSON.parse(fs.readFileSync('./commands/Fun/hi_response.json'));
        if(args && args.length > 0)
        {
            msg.channel.send(`${args[0]}, ${replys[Math.floor(Math.random() * replys.length)]}`)
        }
        else {
            msg.reply(replys[Math.floor(Math.random() * replys.length)]);
        }
    }
}