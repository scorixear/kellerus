import Command from './../command.js';
import permHandler from '../../misc/permissionHandler.js';
import msgHandler from '../../misc/messageHandler.js';
import discordHandler from '../../misc/discordHandler.js';

export default class Ping extends Command {

    constructor(category) {
        super(category);
        this.usage = 'ping';
        this.command = 'ping';
        this.description = 'Tests the Ping of the bot.';
        this.example = 'ping';
    }

    executeCommand(args, msg) {
        try {
            super.executeCommand(args, msg);
        } catch (err) {
            return;
        }
        msgHandler.sendRichText_Default({
            msg: msg,
            title: 'Pong',
            description: `${discordHandler.client.ws.ping}ms`
        });
    }
}