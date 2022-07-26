import { ChatInputCommandInteraction, GuildMember, SlashCommandStringOption } from "discord.js";
import LanguageHandler from "../../handlers/languageHandler";
import CommandInteractionHandle from "../../models/CommandInteractionHandle"
import messageHandler from "../../handlers/messageHandler";
import { Logger, WARNINGLEVEL } from "../../helpers/logger";
import config from "../../config";
import fs from 'fs';
import { getVoiceConnection, joinVoiceChannel, VoiceConnectionStatus, entersState, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus } from '@discordjs/voice'
import TempStorage from "../../handlers/tempStorage";

export default class Play extends CommandInteractionHandle {
  constructor() {
    super(
      'play',
      () => LanguageHandler.language.commands.play.description,
      'play badumtsss',
      'Sound',
      'play <title> [category]',
      [new SlashCommandStringOption().setName('title').setDescription(LanguageHandler.language.commands.play.options.title).setRequired(true),
      new SlashCommandStringOption().setName('category').setDescription(LanguageHandler.language.commands.play.options.category).setRequired(false)],
      false,
    );
  }
  
  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      try {
        await super.handle(interaction);
      } catch (err) {
        return;
      }
      const {fileType} = config.commands.sound.add;
      const originalTitle = interaction.options.getString('title', true);
      const title = originalTitle +'.'+fileType;
      const category = interaction.options.getString('category', false);
      const base = './resources/soundeffects/';
      let path = base;
      if (category && category.trim() != '' && fs.existsSync(base + category+'/'+title)) {
        path += category + '/' + title;
      } else if (fs.existsSync(base + title)) {
        path += title;
      } else {
        const folders = fs.readdirSync(base).filter((x)=>fs.lstatSync(base+x).isDirectory());
        for (const folder of folders) {
          if (fs.existsSync(base+folder+'/'+title)) {
            path += folder + '/' + title;
            break;
          }
        }
      }
      if (path !== base) {
        this.playFile(path, interaction);
        return;
      }
      await messageHandler.replyRichErrorText({
        interaction,
        title: LanguageHandler.language.general.error,
        description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.play.error, [originalTitle]),
      });
      return;
    } catch (err) {
      Logger.Error("Play Unexpected Error", err, WARNINGLEVEL.ERROR);
      if (interaction.member 
        && interaction.member instanceof GuildMember 
        && interaction.member.voice.channel
        && interaction.guild) {
          let connection = getVoiceConnection(interaction.guild.id);
          if (connection) {
            connection.destroy();
          }
        }
    }
  }

  /**
   * 
   * @param {*} path 
   * @param {Discord.Message} msg 
   */
   private playFile(path: string, interaction: ChatInputCommandInteraction) {
    // check that member is connected to a voice channel
    if (interaction.member
      && interaction.member instanceof GuildMember
      && interaction.member.voice.channel
      && interaction.guild) {
        // connect to voice channel
        const connection = joinVoiceChannel({
          channelId: interaction.member.voice.channel.id,
          guildId: interaction.guild.id,
          adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        // when connection interrupts, wait
        connection.on(VoiceConnectionStatus.Disconnected, async(oldState, newState) => {
          try {
            await Promise.race([
              entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
              entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
          } catch {
            // if no reconnection is possible, destroy connection
            connection.destroy();
          }
        })
        
        // On Voice Connection Ready
        connection.on(VoiceConnectionStatus.Ready, () => {
          // retrieve current audio player volume
          const server = TempStorage.getServer(interaction.guild?.id??"undefined");
          // create audio player for file
          const player = createAudioPlayer({
            behaviors: {
              maxMissedFrames: 10,
              noSubscriber: NoSubscriberBehavior.Pause
            },
            debug: false
          });
          // create audio resource for file
          const resource = createAudioResource(path, {inlineVolume: true});
          resource.volume?.setVolume(server?.volume??1);
          
          // start playing file
          player.play(resource);
          // and subscribe to player
          const dispatcher = connection.subscribe(player);
          // when file finished, destroy connection
          player.on(AudioPlayerStatus.Idle, () => {
            player.stop();
            dispatcher?.unsubscribe();
            connection.destroy();
          })
        });
    }
  }
}