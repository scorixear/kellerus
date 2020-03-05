import cmdHandler from '../../misc/commandHandler.js';
import msgHandler from '../../misc/messageHandler.js';
import permHandler from '../../misc/permissionHandler.js';
import config from '../../config.js';
import Command from './../command.js';

export default class Help extends Command {

    constructor(category) {
        super(category);
        this.usage = 'help [command]';
        this.command = 'help';
        this.description = 'Returns a list of commands, you are able to use or informations about a specific command!';
        this.example = 'help\nhelp hi';
    }

    executeCommand(args, msg) {
        let hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
        if (hasPermission === false) {
            return;
        }
        if (args && args.length > 0) {
            let command = cmdHandler.commands.find(v => v.command == args[0]);
            if (command) {
                if (permHandler.checkPermissionSilent(command.permissions, msg) === false) {
                    msgHandler.sendRichText(msg, 'Help Info', [{
                        title: 'Info',
                        text: `This command is unknown. Use \`${config.prefix}help\` for a list of commands.`
                    }]);
                    return;
                }
                let example = '\`\`\`' + config.prefix + command.example.split('\n').reduce((acc, val) => acc + '\`\`\`\n\`\`\`' + config.prefix + val) + '\`\`\`';
                msgHandler.sendRichText_Default({
                    msg: msg,
                    categories: [{
                            title: 'Command',
                            text: `\`${config.prefix}${command.command}\``,
                            inline: false
                        },
                        {
                            title: 'Description',
                            text: command.description,
                        },
                        {
                            title: 'Usage',
                            text: `\`\`\`${config.prefix}${command.usage}\`\`\``
                        },
                        {
                            title: 'Example',
                            text: example
                        }
                    ]
                });
            } else {
                msgHandler.sendRichText(msg, 'Help Info', [{
                    title: 'Info',
                    text: `This command is unknown. Use \`${config.prefix}help\` for a list of commands.`
                }]);
            }
            return;
        }

        let categories = new Map();
        cmdHandler.commands.forEach(cmd => {
            if (permHandler.checkPermissionSilent(cmd.permissions, msg)) {
                if (categories.has(cmd.category)) {
                    categories.get(cmd.category).push(cmd.command);
                } else {
                    categories.set(cmd.category, new Array(cmd.command));
                }
            }
        });
        let embededCategories = new Array({
            title: 'Info',
            text: `Type in \`${config.prefix}<command> [args]\` to use a command!`
        });
        categories.forEach((value, key, map) => {
            let commands = '\`' + config.prefix + value.reduce((acc, val) => acc + '\`\n\`' + config.prefix + val) + '\`';
            embededCategories.push({
                title: key,
                text: commands,
                inline: true
            });
        });
        msgHandler.sendRichText(msg, 'Help Info', embededCategories, 0x616161);
    }
}