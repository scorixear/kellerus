import ytdl from 'ytdl-core';
import config from './../config.js';
import request from 'superagent';
import messageHandler from './messageHandler.js';
import sqlHandler from './sqlHandler.js';
// eslint-disable-next-line no-unused-vars
import Discord from 'discord.js';
import {dic as language} from './languageHandler';
import localStorage from './localStorage.js';
import queueHandler from './queueHandler.js';

const youtubeVideoStart = 'https://www.youtube.com/watch?v=';

/**
 * Set the volume of the server bot
 * @param {string} serverid the serverid of this guild
 * @param {number} volume the volume in between 0 and 2
 */
async function setVolume(serverid, volume) {
  const server = localStorage.getServer(serverid);
  server.volume = volume;
  if (server.dispatcher) {
    server.dispatcher.setVolumeLogarithmic(volume);
  }
}

/**
 * Skips to a title
 * @param {Number} skipNumber amount to skip
 * @param {Discord.Message} msg message so send
 */
function skipQueue(skipNumber, msg) {
  localStorage.getServer(msg.guild.id).queueIndex += skipNumber - 1;
  stop(msg);
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
  let index = server.queueIndex;
  if (index >= queue.length) {
    index = index % queue.length;
    server.queueIndex = index;
  } else if (index < 0) {
    const minusAmount = (index * -1)%queue.length;
    index = queue.length - minusAmount;
    server.queueIndex = index;
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
 * Requests the Name of an youtube url
 * @param {string} url the url to request the name from
 * @param {Discord.Message} msg
 * @return {Promise<string>}
 */
function getNameFromUrl(url, msg) {
  if (!url.startsWith(youtubeVideoStart)) {
    throw new Error('Invalid url');
  }
  const id = url.substr(youtubeVideoStart.length, url.length - youtubeVideoStart.length);
  const requestUrl = 'https://www.googleapis.com/youtube/v3/videos' +
    `?id=${escape(id)}&key=${config.youtubeApiKey}&fields=items(id,snippet(channelId,title,categoryId),statistics)&part=snippet,statistics`;
  return new Promise(function(resolve, reject) {
    request.get(requestUrl).end((error, response)=> {
      if (!error && response.statusCode == 200) {
        const body = response.body;
        if (!body.items ||body.items.length == 0) {
          console.log('Your search gave 0 results');
          reject(new Error(''));
        } else {
          resolve(body.items[0].snippet.title);
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
 * Finds a url for a given search string
 * @param {string} searchKeywords
 * @return {Promise<{title: string, url: string}>} the found url
 */
function youtubeSearch(searchKeywords) {
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
              resolve({title: item.snippet.title, url: youtubeVideoStart+item.id.videoId});
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

export default {
  play,
  skipQueue,
  getNameFromUrl,
  stop,
  youtubeSearch,
  setVolume,
};
