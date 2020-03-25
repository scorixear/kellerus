import permHandler from './../misc/permissionHandler.js';
export default class Command {
  constructor(category) {
    if (new.target == Command) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }
    this.category = category;
    this.permissions = [];
    this.command;
    this.usage;
    this.description;
    this.example;
  }
  executeCommand(args, msg) {
    const hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
    if (hasPermission === false) {
      throw new Error('Invalid');
    }
  };
}
