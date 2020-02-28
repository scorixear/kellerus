import msgHandler from './../misc/messageHandler.js'
import config from './../config.js'

function checkPermissions(permissions, msg, command) {
    let user = msg.member;
    console.log(permissions);
    console.log(user.highestRole.hasPermission(permissions));
    if (user.highestRole.hasPermission(permissions) == false) {
        msgHandler.sendRichText(msg.channel, "Error", [{
            title: 'Message',
            text: `Invalid permissions to use \`${config.prefix}${command}\`!`
        }])
        return false;
    }
    return true;
}

export default {checkPermissions};