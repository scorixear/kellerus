import Command from './../command.js';
import permHandler from '../../misc/permissionHandler.js';
import fs from 'fs';

const replys = JSON.parse(fs.readFileSync('./src/commands/Fun/hi_response.json'));

export default class Hi extends Command {

    constructor(category) {
        super(category);
        this.usage = 'hi';
        this.command = 'hi';
        this.description = 'Says Hi to the Bot!';
        this.example = 'hi\nhi @Kellerus';
    }

    executeCommand(args, msg) {
        try {
            super.executeCommand(args, msg);
        } catch (err) {
            return;
        }
        
        if(args && args.length > 0)
        {
            msg.channel.send(`${args[0]}, ${replys[Math.floor(Math.random() * replys.length)]}`)
        }
        else {
            msg.reply(replys[Math.floor(Math.random() * replys.length)]);
        }
    }
}