import Command from './../command.js';
import permHandler from '../../misc/permissionHandler.js';
import basedir from '../../../basedir';
const https = require('https');
const config = require('../../config');
const fs = require('fs');
import {downloadFromInfo} from "ytdl-core";
export default class Add extends Command {

    constructor(category) {
        super(category);
        this.usage = `add < title> < SoundFile.mp3>`;
        this.command = 'add';
        this.description = 'Stores a SoundFile';
        this.example = 'add badumtsss ';
    }

    async executeCommand(args, msg) {
        const {fileTypes, maxFileSize} = config.commands.sound.add;
        let hasPermission = permHandler.checkPermissions(this.permissions, msg, this.command);
        if(hasPermission === false) {
            return;
        }
        const title = args[0];
        if(title == null) {
            // title is null, thus invalid;
            return;
        }

        const attachment = msg.attachments.first();
        if(attachment == null) {
            // attachment is null, thus invalid;
            return;
        }
        const {url, size, name} = attachment;
    
        if(size > maxFileSize) {
            console.log('Too much');
            return;
        }
        const fileType = '.'+name.split('.')[1];
        if(!fileTypes.includes(fileType)) {
            console.log('Wrong File Type');
            return;
        }

        Add.download(url, basedir+'/resources/soundeffects/'+title+fileType, () => {})
    }


    static download(url, dest, cb) {
        const file = fs.createWriteStream(dest);
        const request = https.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                file.close(cb);  // close() is async, call cb after close completes.
            });
        }).on('error', function(err) { // Handle errors
            console.log(err);
            fs.unlink(dest); // Delete the file async. (But we don't check the result)
            if (cb) cb(err.message);
        });
    };
}