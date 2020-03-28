import ytdl from 'ytdl-core';
import config from './../config.js';
import request from 'superagent';
import messageHandler from './messageHandler.js';
import sqlHandler from './sqlHandler.js';
import {dic as language} from './languageHandler';

async function setVolume(serverid, volume) {
  if (!servers[serverid]) {
    servers[serverid] = {
      queueIndex: 0,
      volume: volume,
    };
    return;
  }
  const server = servers[serverid];
  if (!server.dispatcher) {
    server.volume = volume;
  }
  server.dispatcher.setVolumeLogarithmic(volume);
}

async function play(connection, voiceChannel, serverid, msgChannel) {
  if (!servers[serverid]) {
    servers[serverid] = {
      queueIndex: 0,
      volume: 1,
    };
  }
  const queue = await updateQueue(serverid);
  const server = servers[serverid];
  let index = server.queueIndex;
  if (index >= queue.length) {
    index = 0;
    server.queueIndex = 0;
  }

  if (queue.length > 0) {
    server.dispatcher = connection.play(
        ytdl(queue[index].url, {
          filter: 'audioonly',
          quality: 'highestaudio',
          format: 'mp3',
          highWaterMark: 1 << 25,
        }, {
          highWaterMark: 1,
        }));
    server.dispatcher.setVolumeLogarithmic(server.volume);
    server.dispatcher.on('start', () => {
      messageHandler.sendRichTextExplicit(undefined, msgChannel, undefined,
          language.handlers.musicPlayer.labels.playing,
          [{
            title: language.general.description,
            text: language.handlers.musicPlayer.labels.currently_playing,
            inline: true,
          }, {
            title: language.handlers.musicPlayer.labels.volume,
            text: (server.volume * 100) + '%',
            inline: true,
          }, {
            title: language.general.title,
            text: `\`${queue[index].title}\``,
            inline: false,
          }, {
            title: 'Url',
            text: queue[index].url,
            inline: true,
          }]);
    });
    server.dispatcher.on('finish', () => {
      server.queueIndex++;
      server.dispatcher = null;
      if (voiceChannel.members.size <= 1 && connection) {
        connection.disconnect();
        messageHandler.sendRichTextDefaultExplicit({
          channel: msgChannel,
          title: language.handlers.musicPlayer.labels.disconnected,
          description: language.handlers.musicPlayer.labels.disconnected_emptyChannel,
        });
      } else {
        play(connection, voiceChannel, serverid, msgChannel);
      }
    });
    server.dispatcher.on('error', (err) => {
      console.log(err);
    });
  } else {
    connection.disconnect();
    messageHandler.sendRichTextDefaultExplicit({
      channel: msgChannel,
      title: 'Queue',
      description: language.handlers.musicPlayer.labels.disconnected_emptyQueue,
      color: 0xcc0000,
    });
  }
}

function stop(msg) {
  if (servers[msg.guild.id] && servers[msg.guild.id].dispatcher) {
    servers[msg.guild.id].dispatcher.end();
  }
}

function youtubeSearch(searchKeywords, msg) {
  const requestUrl = 'https://www.googleapis.com/youtube/v3/search' +
    `?part=snippet&q=${escape(searchKeywords)}&key=${config.youtubeApiKey}`;
  return new Promise(function(resolve, reject) {
    request.get(requestUrl).end((error, response) => {
      if (!error && response.statusCode == 200) {
        const body = response.body;
        if (body.items.length == 0) {
          console.log('Your search gave 0 results');
          reject(new Error(''));
        } else {
          for (const item of body.items) {
            if (item.id.kind === 'youtube#video') {
              queueYtAudioStream(item.id.videoId, item.snippet.title, msg).then((url) => resolve(url));
              break;
            }
          }
        }
      } else {
        console.log('Unexpected error when searching YouTube');
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(null);
      }
    });
  });
}

async function queueYtAudioStream(videoId, title, msg) {
  const streamUrl = `https://www.youtube.com/watch?v=${videoId}`;
  if (!servers[msg.guild.id]) {
    servers[msg.guild.id] = {
      queueIndex: 0,
      volume: 1,
    };
  }
  const success = await sqlHandler.addQueue(title, streamUrl, msg.guild.id);

  if (success) {
    return title;
  } else {
    return '$$$$ignore' + title;
  }
}

async function updateQueue(serverid) {
  return await sqlHandler.getQueue(serverid);
}

export default {
  play,
  stop,
  youtubeSearch,
  updateQueue,
  setVolume,
};
