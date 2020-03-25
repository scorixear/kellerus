export default class Command {
    constructor(category) {
        if (new.target == Command) {
            throw new TypeError('Cannot construct Abstract instances directly');
        }
        this.category = category;
        this.permissions = new Array();
    }
    category;
    permissions;
    command;
    usage;
    description;
    example;
    executeCommand(args, msg) {
        let hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
        if (hasPermission === false) {
            throw new Error("Invalid");
        }
    };
}