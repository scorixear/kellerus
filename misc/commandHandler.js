import Config from './../config.js'
import Fs from 'fs'

const commands = Fs.readdirSync('./commands/');

function parseCommand(msg) {
    if(msg.content[0] !== Config.prefix)
    {
        return;
    }
    let args = msg.content.substring(Config.prefix.length).split(" ");
    let cmd = commands.find(c => c === args[0]+".js");
    if(cmd)
    {
        import(`./../commands/${cmd}`).then((requiredCmd)=>{
            try {
            
                requiredCmd.executeCommand(args.splice(0,1), msg);
            }
            catch (err)
            {
                msg.channel.send(`Command not defined. Type ${Config.prefix}help for a list of available commands.`)
            }
        })
    }
    else {
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
