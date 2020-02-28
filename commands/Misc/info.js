import msgHandler from '../../misc/messageHandler.js'
import config from '../../config.js'

function executeCommand(args, msg) {
    let categories = new Array();
    categories[0] = {title:'Version', text:config.version, inline:true};
    categories[1] = {title:'Repository', text:config.repo, inline:true};
    categories[2] = {title:'Author', text:'Paul Keller'};
    msgHandler.sendRichText(msg.channel, 'Bot Info', categories, 0xF1C40F)
}

let category;

module.exports = {executeCommand, command: 'info', usage: 'info', category};