import Command from './../command.js';
import permHandler from '../../misc/permissionHandler.js';
import config from '../../config.js'
import msgHandler from '../../misc/messageHandler.js';
import musicPlayer from '../../misc/musicPlayer.js';
import sqlHandler from '../../misc/sqlHandler.js';

export default class Queue extends Command {

    constructor(category) {
        super(category);
        this.usage = 'queue <link/clear/list/search params>';
        this.command = 'queue';
        this.permissions = ['MOVE_MEMBERS'];
        this.description = 'Queues a song, lists all songs in the queue or clears the queue.\nSongs can be queued by entering the youtube url or a specific search string.';
        this.example = 'queue list\nqueue clear\nqueue Song_Title\nqueue https://www.youtube.com/watch?v=video_id';
    }

    async executeCommand(args, msg) {
        let hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
        if (hasPermission === false) {
            return;
        }

        if (args && args.length > 0) {
            if (args[0] === 'clear' && args.length === 1) {
                if (!servers[msg.guild.id]) {
                    servers[msg.guild.id] = {
                        queueIndex: 0
                    };
                }
                sqlHandler.clearQueue(msg.guild.id).then(success => {
                    if (success) {
                        msgHandler.sendRichText_Default({
                            msg: msg,
                            title: 'Queue',
                            description: 'Queue cleared'
                        });
                    } else {
                        msgHandler.sendRichText_Default({
                            msg: msg,
                            title: 'Queue',
                            description: 'Queue could not be cleared.',
                            color: 0xcc0000
                        });
                    }
                });
                return;
            }
            if (args[0] === 'list' && args.length === 1) {
                if (!servers[msg.guild.id]) {
                    servers[msg.guild.id] = {
                        queueIndex: 0
                    };
                }
                let queue = await musicPlayer.updateQueue(msg.guild.id);
                if (queue.length === 0) {
                    msgHandler.sendRichText_Default({
                        msg: msg,
                        title: 'Queue List',
                        description: 'Empty Queue'
                    });
                } else {
                    let queuelist ='';
                    for(let i = 0;i<queue.length;i++) {
                        if(i=== servers[msg.guild.id].queueIndex) {
                            queuelist += `--> \`${queue[i].title}\`\n`;
                        } else {
                            queuelist += `- \`${queue[i].title}\`\n`;
                        }
                    }
                    msgHandler.sendRichText_Default({
                        msg: msg,
                        title: 'Queue List',
                        description: queuelist
                    });
                }

                return;
            }

            if (!servers[msg.guild.id]) {
                servers[msg.guild.id] = {
                    queueIndex: 0
                };
            }

            if (args[0].startsWith('https://www.youtube.com/watch?v=')) {
                sqlHandler.addQueue(args[0], args[0], msg.guild.id).then(success => {
                    if (success) {
                        msgHandler.sendRichText_Default({
                            msg: msg,
                            title: 'Queue',
                            description: `Title \`${args[0]}\` added.`
                        });
                    } else {
                        msgHandler.sendRichText_Default({
                            msg: msg,
                            title: 'Queue',
                            description: `Title \`${args[0]}\` already in the queue.`
                        });
                    }
                });
            } else {
                musicPlayer.YoutubeSearch(args, msg).then(title => {
                    if (title.startsWith('$$$$ignore')) {
                        msgHandler.sendRichText_Default({
                            msg: msg,
                            title: 'Queue',
                            description: `Title \`${title.substring(10)}\` is already in the queue.`
                        });
                    } else {
                        msgHandler.sendRichText_Default({
                            msg: msg,
                            title: 'Queue',
                            description: `Title \`${title}\` added.`
                        });
                    }
                }).catch(err => {
                    if (err) {
                        msgHandler.sendRichText_Default({
                            msg: msg,
                            title: 'Queue',
                            description: `No Results found!`,
                            color: 0xCC0000
                        });
                    } else {
                        msgHandler.sendRichText_Default({
                            msg: msg,
                            title: 'Error',
                            description: `Unexpected Result while connection to the Youtube API.`,
                            color: 0xCC0000
                        });
                    }
                });
            }
        } else {
            msgHandler.sendRichText_Default({
                msg: msg,
                title: 'Error',
                description: `No title given! Use \`${config.prefix}${this.usage}\` to queue a title.`,
                color: 0xCC0000
            });
        }
    }
}