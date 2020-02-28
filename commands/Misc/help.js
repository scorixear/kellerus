import cmdHandler from '../../misc/commandHandler.js';
import msgHandler from '../../misc/messageHandler.js';
import config from '../../config.js';

function executeCommand(args, msg) {
    if(args && args.Length > 0){
        let command = cmdHandler.commands.find(v=>v.command == args[0]);
        if(command)
        {
            msgHandler.sendRichText(msg.channel, 'HelpInfo', 
            [{title:'Command', text:`\`${config.prefix}${command.command}`},
            {title:'Usage', text:`\`${config.prefix}${command.usage}`}]);
        }
        else {
            msgHandler.sendRichText(msg.channel, 'Help Info', [{title:'Info',text:`This command is unknown. Use \`${config.prefix}help\` for a list of commands.`}]);
        }
        return;
    }

    let categories = new Map();
    cmdHandler.commands.forEach(cmd =>{
        if(categories.has(cmd.category)) {
            categories.get(cmd.category).push(cmd.command);
        }
        else {
            categories.set(cmd.category, new Array(cmd.command));
        }
    });
    let embededCategories = new Array({title:'Info',text:`Type in \`${config.prefix}<command> [args]\` to use a command!`});
    categories.forEach((value, key, map) => {
        let commands = '\`'+config.prefix+value.reduce((acc, val)=>acc+'\`\n\`'+config.prefix+val)+'\`';
        embededCategories.push({title:key, text:commands, inline: true});
    });
    console.log(embededCategories);
    msgHandler.sendRichText(msg.channel, 'Help Info',embededCategories, 0x616161);
}

let category;

module.exports = {executeCommand, command: 'help', usage: 'help [command]', category};