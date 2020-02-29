import msgHandler from './../misc/messageHandler.js'
import config from './../config.js'

function checkPermissions(permissions, msg, command) {
    let user = msg.member;
    if (user.highestRole.hasPermission(permissions) == false) {
        msgHandler.sendRichText(msg.channel, "Error", [{
            title: 'Message',
            text: `Invalid permissions to use \`${config.prefix}${command}\`!`
        }])
        return false;
    }
    return true;
}

function checkPermissionSilent(permissions, msg) {
    let user = msg.member;
    return user.highestRole.hasPermission(permissions);
}

export default {checkPermissions, checkPermissionSilent};