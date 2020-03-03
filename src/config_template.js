import fs from 'fs';

const token = 'your_token';
const discord_url = 'https://discordapp.com/oauth2/authorize?client_id=client_id&scope=bot&permissions=2146958807';

const youtube_api_key = 'your_key';

const repository = 'https://github.com/scorixear/kellerus';

const bot_prefix = '!';
const version = JSON.parse(fs.readFileSync('package.json')).version;

const dbhost = '127.0.0.1';
const dbuser = 'username';
const dbpassword = 'password';
const dbport = '3306';
const dbDataBase = 'kellerus';

module.exports = {
    token: token,
    prefix: bot_prefix,
    repo: repository,
    version: version,
    dbhost: dbhost,
    dbuser: dbuser,
    dbpassword: dbpassword,
    dbport: dbport,
    dbDataBase: dbDataBase,
    youtube_api_key: youtube_api_key
};