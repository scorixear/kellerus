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
    executeCommand(args, msg) {

    };
}