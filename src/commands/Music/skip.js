import Command from './../command.js';
import permHandler from '../../misc/permissionHandler.js';
import msgHandler from '../../misc/messageHandler.js';
import musicPlayer from '../../misc/musicPlayer.js';
import sqlHandler from '../../misc/sqlHandler.js';

export default class Skip extends Command {

    constructor(category) {
        super(category);
        this.usage = 'skip';
        this.command = 'skip';
    }

    executeCommand(args, msg) {
        let hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
        if (hasPermission === false) {
            return;
        }
        if (!servers[msg.guild.id]) {
            servers[msg.guild.id] = {
                queueIndex: 0
            };
        }
        sqlHandler.getQueue(msg.guild.id).then(queue => {
            if (queue.length > 0) {
                if (msg.guild.voice.connection) {
                    musicPlayer.Stop(msg);
                }
            }
        });
        
    }
}