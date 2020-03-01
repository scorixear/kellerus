import Command from './../command.js';
import permHandler from '../../misc/permissionHandler.js';
import msgHandler from '../../misc/messageHandler.js';
import musicPlayer from '../../misc/musicPlayer.js';

export default class Join extends Command {

    constructor(category) {
        super(category);
        this.usage = 'join';
        this.command = 'join';
    }

    executeCommand(args, msg) {
        let hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
        if (hasPermission === false) {
            return;
        }

        if (msg.member.voiceChannel) {
            if (!msg.guild.voiceConnection) {
                msg.member.voiceChannel.join().then(connection => {
                    musicPlayer.Play(msg.guild.voiceConnection, msg);
                    msgHandler.sendRichText_Default({
                        channel: msg.channel,
                        title: 'Joined',
                        description: 'Successfully Joined!'
                    });
                });
            }
        } else {
            msgHandler.sendRichText_Default({
                channel: msg.channel,
                title: 'Error',
                description: 'You must be in a voice channel to summon me!',
                color: 0xCC0000
            });
        }
    }
}