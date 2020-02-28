import Config from './../config.js'
import Fs from 'fs'

const commands = Fs.readdirSync('./commands/');
const commandDir = new Map();
commands.forEach((command)=>{
    commandDir.set(command, require(`./../commands/${command}`))
})
    

function parseCommand(msg) {
    if(msg.content[0] !== Config.prefix) return;
    
    let args = msg.content.substring(Config.prefix.length).split(" ");
    let module = commandDir.get(args[0]+".js");
    if(!module || !module.executeCommand)
    {
        msg.channel.send(`Command not defined. Type ${Config.prefix}help for a list of available commands.`)
        return;
    }
    try {
        module.executeCommand(args.slice(1), msg);
    }
    catch (err) {
        console.log(err)
        msg.channel.send(`Command not defined. Type ${Config.prefix}help for a list of available commands.`)
    }
    
    return;
    switch(args[0]){
        case 'ban':
            break;
        case 'help':
            break;
        case 'clear':
            if(!args[1]) return msg.reply('Error please define second arg');
            msg.channel.bulkDelete(args[1])
            break;
        case 'ping':
            msg.channel.send('pong');
            break;
        case 'repo':
            msg.channel.send(config.repo);
            break;
        case 'info':
            switch(args[1])
            {
                case 'version':
                    msg.channel.send('Version '+config.version);
                    break;
                default:
                    msg.channel.send('Invalid arguments! ☹');
                    break;
            }
            break;
        case 'hi':
            msg.reply('Hi Friend');
            break;
    }
}

export default { parseCommand };
