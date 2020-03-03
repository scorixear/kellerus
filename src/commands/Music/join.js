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

        if (msg.member.voice.channel) {
                msg.member.voice.channel.join().then(connection => {
                    musicPlayer.Play(connection, msg.member.voice.channel, msg.guild.id, msg.channel);
                });
                msgHandler.sendRichText_Default({
                    channel: msg.channel,
                    title: 'Joined',
                    description: 'Successfully Joined!'
                });

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