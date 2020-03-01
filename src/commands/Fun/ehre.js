import Command from './../command.js';
import permHandler from '../../misc/permissionHandler.js';
import sqlHandler from '../../misc/sqlHandler.js';
import msgHandler from '../../misc/messageHandler.js';

export default class Ehre extends Command {

    constructor(category) {
        super(category);
        this.usage = 'ehre';
        this.command = 'ehre';
    }

    executeCommand(args, msg) {
        let hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
        if(hasPermission === false) {
            return;
        }
        let targetuser;
        if(args && args.length >=1) {
            targetuser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
        }
        else {
            targetuser = msg.guild.member(msg.author);
        }

        if(!targetuser){
            msgHandler.sendRichText_Default({
                channel: msg.channel,
                title: 'Error',
                description: 'User not found',
                color: 0xCC0000
            });
            return;
        }

        sqlHandler.addHonorCount(targetuser.user).then((cnt)=>{
            msgHandler.sendRichText_Default({channel: msg.channel, title: 'Ehre', description: `${targetuser} war \`${cnt}\` mal ehrenvoll.`, color:0x00CC00});
        });
        
        
    }
}