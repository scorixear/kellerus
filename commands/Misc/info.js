import msgHandler from '../../misc/messageHandler.js'
import config from '../../config.js'
import Command from './../command.js';

export default class Info extends Command {

    constructor(category) {
        super(category);
        this.usage = 'info';
        this.command = 'info';
    }

    executeCommand(args, msg) {
        let categories = new Array();
        categories[0] = {
            title: 'Version',
            text: config.version,
            inline: true
        };
        categories[1] = {
            title: 'Repository',
            text: config.repo,
            inline: true
        };
        categories[2] = {
            title: 'Author',
            text: 'Paul Keller'
        };
        msgHandler.sendRichText(msg.channel, 'Bot Info', categories, 0xF1C40F)
    }
}