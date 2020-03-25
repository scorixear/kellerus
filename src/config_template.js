import fs from 'fs';

const token = 'your_token';
const discordUrl = 'https://discordapp.com/oauth2/authorize?client_id=client_id&scope=bot&permissions=2146958807';

const youtubeApiKey = 'your_key';

const repository = 'https://github.com/scorixear/kellerus';

const botPrefix = '!';
const version = JSON.parse(fs.readFileSync('package.json')).version;

const dbhost = '127.0.0.1';
const dbuser = 'username';
const dbpassword = 'password';
const dbport = '3306';
const dbDataBase = 'kellerus';

module.exports = {
  token: token,
  prefix: botPrefix,
  repo: repository,
  version: version,
  dbhost: dbhost,
  dbuser: dbuser,
  dbpassword: dbpassword,
  dbport: dbport,
  dbDataBase: dbDataBase,
  youtube_api_key: youtubeApiKey,
};
