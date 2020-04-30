import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./src/config.json'));
config.commands = JSON.parse(fs.readFileSync('./src/commands.json'));
config.version = JSON.parse(fs.readFileSync('package.json')).version;

export default config;
