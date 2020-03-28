import msgHandler from './../misc/messageHandler.js';
import config from './../config.js';
import {dic as language, replaceArgs} from '../misc/languageHandler';

function checkPermissions(permissions, msg, command) {
  const user = msg.member;
  if (user.hasPermission(permissions) == false) {
    msgHandler.sendRichText(msg, language.general.error, [{
      title: language.general.message,
      text: replaceArgs(language.handlers.permissions.error, [config.botPrefix, command]),
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
