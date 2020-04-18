import msgHandler from './../misc/messageHandler.js';
import config from './../config.js';
// eslint-disable-next-line no-unused-vars
import Discord from 'discord.js';
import {dic as language, replaceArgs} from '../misc/languageHandler';

/**
 * Checks if the user has permissions and prints a message if not
 * @param {Array<string>} permissions
 * @param {Discord.Message} msg
 * @param {string} command
 * @return {boolean}
 */
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

/**
 * Checks if the user has permissions
 * @param {Array<string>} permissions
 * @param {Discord.Message} msg
 * @return {boolean}
 */
function checkPermissionSilent(permissions, msg) {
  const user = msg.member;
  return user.hasPermission(permissions);
}

export default {checkPermissions, checkPermissionSilent};
