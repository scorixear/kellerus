import fs from 'fs';
const version = JSON.parse(fs.readFileSync('package.json').toString()).version;
const commands = JSON.parse(fs.readFileSync('./src/commands.json').toString());

export default {
  botPrefix: '/',
  playPrefix: ',',
  version,
  commands,
  discordUrl:
    'https://discordhttps://discordapp.com/oauth2/authorize?client_id=692071942768951296&scope=bot&permissions=2146958807app.com/oauth2/authorize?client_id=client_id&scope=bot&permissions=2146958807',
  repository: 'https://github.com/scorixear/kellerus',
  language: 'de-DE',
  default_queue: 'Default_Queue'
};
