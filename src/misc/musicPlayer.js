import ytdl from 'ytdl-core';
import config from './../config.js';
import request from 'superagent';
import messageHandler from './messageHandler.js';
import sqlHandler from './sqlHandler.js';
// eslint-disable-next-line no-unused-vars
import Discord from 'discord.js';
import {dic as language} from './languageHandler';
import localStorage from './localStorage.js';

/**
 * Set the volume of the server bot
 * @param {string} serverid the serverid of this guild
 * @param {number} volume the volume in between 0 and 2
 */
async function setVolume(serverid, volume) {
  const server = localStorage.getServer(serverid);
  server.volume = volume;
  if (!server.dispatcher) {
    server.dispatcher.setVolumeLogarithmic(volume);
  }
}

/**
 * Starts the stream of queued titles
 * @param {Discord.VoiceConnection} connection
 * @param {Discord.VoiceChannel} voiceChannel
 * @param {string} serverid
 * @param {Discord.Channel} msgChannel
 */
async function play(connection, voiceChannel, serverid, msgChannel) {
  const queue = await updateQueue(serverid);
  const server = localStorage.getServer(serverid);
  console.log(server);
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
        }));
    setVolume(serverid, server.volume);
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
          description: language.handlers.musicPlayer.labels.disconnecting_emptyChannel,
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
      description: language.handlers.musicPlayer.labels.disconnecting_emptyQueue,
      color: 0xcc0000,
    });
  }
}

/**
 * Stops the stream
 * @param {Discord.Message} msg
 */
function stop(msg) {
  const server = localStorage.getServer(msg.guild.id);
  if (server.dispatcher) {
    server.dispatcher.end();
  }
}

/**
 * Finds a url for a given search string
 * @param {string} searchKeywords
 * @param {Discord.Message} msg
 * @return {Promise<string>} the found url
 */
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

/**
 * Queues a Youtube Audio Stream
 * @param {string} videoId
 * @param {string} title
 * @param {Discord.Message} msg
 * @return {string} returns the title ofr '$$$$ignore' + title if not successfull
 */
async function queueYtAudioStream(videoId, title, msg) {
  const streamUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const success = await sqlHandler.addQueue(title, streamUrl, msg.guild.id);

  if (success) {
    return title;
  } else {
    return '$$$$ignore' + title;
  }
}

/**
 * Returns the Queue of a server
 * @param {number} serverid
 * @return {Promise<Array<{url: string, title: string}>>}
 */
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
