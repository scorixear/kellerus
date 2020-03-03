import YTDL from 'ytdl-core';
import config from './../config.js';
import request from 'superagent';
import messageHandler from './messageHandler.js';
import sqlHandler from './sqlHandler.js';

let disableMessage = false;
async function Play(connection, voiceChannel, serverid, msgChannel) {
    if (!servers[serverid]) {
        servers[serverid] = {
            queueIndex: 0
        }
    }
    let queue = await updateQueue(serverid);
    let server = servers[serverid];
    let index = server.queueIndex;
    if (index >= queue.length) {
        index = 0;
        server.queueIndex = 0;
    }

    if (queue.length > 0) {
        if(disableMessage === false) {
            messageHandler.sendRichText(msgChannel, 'Playing', [{
                title: 'Description',
                text: 'Currently playing:'
            }, {
                title: 'Title',
                text: `\`${queue[index].title}\``,
                inline: true
            }, {
                title: 'Url',
                text: queue[index].url,
                inline: true
            }]);
        } else {
            disableMessage =false;
        }
        server.dispatcher = connection.play(
            YTDL(queue[index].url, {
              filter: "audioonly",
              quality: "highestaudio",
              format: "mp3",
              highWaterMark: 1<<25
              }, {highWaterMark: 1})
         );
        server.dispatcher.on('finish', () => {
            console.log("End");
            server.queueIndex++;
            server.dispatcher = null;
            if (voiceChannel.members.size <= 1 && connection) {
                connection.disconnect();
                messageHandler.sendRichText_Default({
                    channel: msgChannel,
                    title: 'Disconnected',
                    description: 'Left channel because nobody was listening :('
                });
            } else {
                Play(connection, voiceChannel, serverid, msgChannel);
            }
        });
        server.dispatcher.on('error', (err) => {
            console.log(err);
        });
    } else {
        connection.disconnect();
        messageHandler.sendRichText_Default({
            channel: msgChannel,
            title: 'Queue',
            description: 'Queue empty! Disconnecting.',
            color: 0xcc0000
        });
    }


}

function Stop(msg) {
    if (servers[msg.guild.id] && servers[msg.guild.id].dispatcher) {
        servers[msg.guild.id].dispatcher.end();
    }
}

function YoutubeSearch(searchKeywords, msg) {
    var requestUrl = 'https://www.googleapis.com/youtube/v3/search' + `?part=snippet&q=${escape(searchKeywords)}&key=${config.youtube_api_key}`;
    return new Promise(function (resolve, reject) {
        request.get(requestUrl).end((error, response) => {
            if (!error && response.statusCode == 200) {
                let body = response.body;
                if (body.items.length == 0) {
                    console.log("Your search gave 0 results");
                    reject('');
                } else {
                    for (var item of body.items) {
                        if (item.id.kind === 'youtube#video') {
                            QueueYtAudioStream(item.id.videoId, item.snippet.title, msg).then(url => resolve(url));
                            break;
                        }
                    }
                }
            } else {
                console.log("Unexpected error when searching YouTube");
                reject(null);
            }
        });
    });
}


async function QueueYtAudioStream(videoId, title, msg) {
    var streamUrl = `https://www.youtube.com/watch?v=${videoId}`;
    if (!servers[msg.guild.id]) {
        servers[msg.guild.id] = {
            queueIndex: 0
        }
    }
    let success = await sqlHandler.addQueue(title, streamUrl, msg.guild.id);
    
    if(success) {
        return title;
    } else {
        return '$$$$ignore' + title
    }

    
}

async function updateQueue(serverid) {
    return await sqlHandler.getQueue(serverid);
}

export default {
    Play,
    Stop,
    YoutubeSearch,
    updateQueue,
    disableMessage
};