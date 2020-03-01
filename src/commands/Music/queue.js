import Command from './../command.js';
import permHandler from '../../misc/permissionHandler.js';
import config from '../../config.js'
import msgHandler from '../../misc/messageHandler.js';
import musicPlayer from '../../misc/musicPlayer.js';

export default class Queue extends Command {

    constructor(category) {
        super(category);
        this.usage = 'queue <link/clear/list/search params>';
        this.command = 'queue';
    }

    executeCommand(args, msg) {
        let hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
        if (hasPermission === false) {
            return;
        }

        if (args && args.length > 0) {
            if (args[0] === 'clear' && args.length === 1) {
                if (!servers[msg.guild.id]) {
                    servers[msg.guild.id] = {
                        queue: []
                    };
                }
                servers[msg.guild.id].queue = [];
                msgHandler.sendRichText_Default({
                    channel: msg.channel,
                    title: 'Queue',
                    description: 'Queue cleared'
                });
                return;
            }
            if(args[0] === 'list' && args.length === 1) {
                if (!servers[msg.guild.id]) {
                    servers[msg.guild.id] = {
                        queue: []
                    };
                }
                let queue = servers[msg.guild.id].queue;
                if(queue.length === 0) {
                    msgHandler.sendRichText_Default({channel: msg.channel, title: 'Queue List', description: 'Empty Queue'});
                }
                else {
                    let queuelist = queue.reduce((acc, val) => acc.title + "`\n- `" + val.title);
                    if(queuelist.title){
                        queuelist = queuelist.title;
                    }
                    msgHandler.sendRichText_Default({channel: msg.channel, title: 'Queue List', description: '- `'+String(queuelist)+'`'});
                }
                return;
            }

            if (!servers[msg.guild.id]) {
                servers[msg.guild.id] = {
                    queue: []
                };
            }

            if (args[0].startsWith('https://www.youtube.com/watch?v=')) {
                if (!servers[msg.guild.id].queueö.find(q=>q.title === args[0])) {
                    servers[msg.guild.id].queue.push({title:args[0],url:args[0]});
                    msgHandler.sendRichText_Default({
                        channel: msg.channel,
                        title: 'Queue',
                        description: `Title \`${args[0]}\` added.`
                    });
                } else {
                    msgHandler.sendRichText_Default({
                        channel: msg.channel,
                        title: 'Queue',
                        description: `Title \`${args[0]}\` already in the queue.`
                    });
                }

            } else {
                musicPlayer.YoutubeSearch(args, msg).then(title => {
                    if (title.startsWith('$$$$ignore')) {
                        msgHandler.sendRichText_Default({
                            channel: msg.channel,
                            title: 'Queue',
                            description: `Title \`${title.substring(10)}\` is already in the queue.`
                        });
                    } else {
                        msgHandler.sendRichText_Default({
                            channel: msg.channel,
                            title: 'Queue',
                            description: `Title \`${title}\` added.`
                        });
                    }
                }).catch(err => {
                    if (err) {
                        msgHandler.sendRichText_Default({
                            channel: msg.channel,
                            title: 'Queue',
                            description: `No Results found!`,
                            color: 0xCC0000
                        });
                    } else {
                        msgHandler.sendRichText_Default({
                            channel: msg.channel,
                            title: 'Error',
                            description: `Unexpected Result while connection to the Youtube API.`,
                            color: 0xCC0000
                        });
                    }
                });
            }
        } else {
            msgHandler.sendRichText_Default({
                channel: msg.channel,
                title: 'Error',
                description: `No title given! Use \`${config.prefix}${this.usage}\` to queue a title.`,
                color: 0xCC0000
            });
        }
    }
}