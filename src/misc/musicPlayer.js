import YTDL from 'ytdl-core';
import config from './../config.js';
import request from 'superagent';

function Play(connection, msg) {
    if (!servers[msg.guild.id]) {
        servers[msg.guild.id] = {
            queue: []
        }
    }
    let server = servers[msg.guild.id];
    if (server.queue && server.queue.length > 0) {
        server.dispatcher = connection.playStream(YTDL(server.queue[0].url, {
            filter: "audioonly"
        }));
        server.dispatcher.on('end', () => {
            server.queue.push(server.queue.shift());
            server.dispatcher = null;
            Play(connection, msg);
        });
        server.dispatcher.on('error', (err)=> {
            console.log(err);
        })
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
                            let url = QueueYtAudioStream(item.id.videoId, item.snippet.title, msg);
                            resolve(url);
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


function QueueYtAudioStream(videoId, title, msg) {
    var streamUrl = `https://www.youtube.com/watch?v=${videoId}`;
    if (!servers[msg.guild.id]) {
        servers[msg.guild.id] = {
            queue: []
        }
    }
    let server = servers[msg.guild.id];
    let found = server.queue.find(q => q.title === title)
    if (!found) {
        server.queue.push({title:title, url:streamUrl});
        return title;
    } else {
        return '$$$$ignore'+title
    }
}
export default {
    Play,
    Stop,
    YoutubeSearch
};