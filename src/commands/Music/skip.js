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
        let server = servers[msg.guild.id];
        sqlHandler.getQueue(msg.guild.id).then(queue => {
            if (queue.length > 0) {
                let oldTitle = queue[server.queueIndex];
    
                if (msg.guild.voiceConnection) {
                    musicPlayer.Stop(msg);
                }
                msgHandler.sendRichText_Default({
                    channel: msg.channel,
                    title: 'Queue',
                    description: `Title \`${oldTitle.title}\` skipped!`
                });
            }
        });
        
    }
}