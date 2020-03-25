import msgHandler from './../misc/messageHandler.js';
import config from './../config.js';

function checkPermissions(permissions, msg, command) {
  const user = msg.member;
  if (user.hasPermission(permissions) == false) {
    msgHandler.sendRichText(msg, 'Error', [{
      title: 'Message',
      text: `Invalid permissions to use \`${config.prefix}${command}\`!`,
    }]);
    return false;
  }
  return true;
}

function checkPermissionSilent(permissions, msg) {
  const user = msg.member;
  return user.hasPermission(permissions);
}

export default {checkPermissions, checkPermissionSilent};
