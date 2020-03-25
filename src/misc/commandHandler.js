import config from './../config.js';
import msgHandler from './../misc/messageHandler.js'
import Fs from 'fs';

const commandFiles = Fs.readdirSync('./src/commands/');
const commands = new Array();
commandFiles.forEach((folder) => {
    if(folder !== 'command.js') {
        Fs.readdirSync(`./src/commands/${folder}/`).forEach(file => {
            if(file.endsWith('.js')) {
                let command = require(`./../commands/${folder}/${file}`);
                console.log(command);
                if(command.commands) {
                    for(let cmd of command.commands)
                    {
                        commands.push(Reflect.construct(cmd, [folder]));
                    }
                }
                else {
                    commands.push(Reflect.construct(command.default, [folder]));
                }
            }
        });
    }
});

function parseCommand(msg) {
    
    if (msg.content[0] !== config.prefix) return;
    
    let args = msg.content.substring(config.prefix.length).split(" ");
    
    let module = commands.find(c => c.command.toLowerCase() == args[0].toLowerCase());
    if (!module || !module.executeCommand) {
        msgHandler.sendRichText(msg, 'Error', [{
            title: 'Message',
            text: `This command is unknown. Use \`${config.prefix}help\` for a list of commands.`
        }]);
        return;
    }
    try {
        module.executeCommand(args.slice(1), msg);
    } catch (err) {
        console.log(err);
        msgHandler.sendRichText(msg, 'Error', [{
            title: 'Message',
            text: `This command is unknown. Use \`${config.prefix}help\` for a list of commands.`
        }]);
    }
}

export default {
    parseCommand,
    commands: commands
};