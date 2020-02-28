import Config from './../config.js';
import Fs from 'fs';

const commandFiles = Fs.readdirSync('./commands/');
const commands = new Array();
commandFiles.forEach((folder) => {
    if(folder !== 'command.js') {
        Fs.readdirSync(`./commands/${folder}/`).forEach(file => {
            let command = require(`./../commands/${folder}/${file}`);
            commands.push(Reflect.construct(command.default, [folder]));
        });
    }
});

function parseCommand(msg) {
    if (msg.content[0] !== Config.prefix) return;

    let args = msg.content.substring(Config.prefix.length).split(" ");
    
    let module = commands.find(c => c.command == args[0]);
    if (!module || !module.executeCommand) {
        msg.channel.send(`Command not defined. Type ${Config.prefix}help for a list of available commands.`);
        return;
    }
    try {
        module.executeCommand(args.slice(1), msg);
    } catch (err) {
        console.log(err);
        msg.channel.send(`Command not defined. Type ${Config.prefix}help for a list of available commands.`);
    }
}

export default {
    parseCommand,
    commands: commands
};