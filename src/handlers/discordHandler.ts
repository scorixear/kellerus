import {Client, GatewayIntentBits, Awaitable, VoiceBasedChannel, Partials, ChannelType} from 'discord.js';
export default class DiscordHandler {
  public client: Client;
  private tempChannels: VoiceBasedChannel[];
  constructor() {
    this.client = new Client({
      partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
      intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages]
    });
    this.tempChannels = []
    this.client.on('voiceStateUpdate', async (newVoice, oldVoice) => {
      const newUserChannel = oldVoice.channel;
      const oldUserChannel = newVoice.channel;

      if (oldUserChannel !== newUserChannel) {
        if (oldUserChannel && this.tempChannels.includes(oldUserChannel)) {
          if (oldUserChannel.members.size === 0) {
            for (let i = 0; i < this.tempChannels.length; i++) {
              if (this.tempChannels[i] === oldUserChannel) {
                this.tempChannels.splice(i, 1);
                break;
              }
            }
            await oldUserChannel.delete();
          }
        }
        if (newUserChannel) {
          const replacement = await global.sqlHandler.findChannel(newUserChannel.id);
          if (replacement) {
            let counter = 1;
            while (newVoice.guild.channels.cache.find((c) => c.name === replacement.replace('$', counter))) {
              counter++;
            }
            const channel = await newVoice.guild.channels.create({
              name: replacement.replace('$', counter),
              type: ChannelType.GuildVoice,
              parent: newUserChannel.parent??undefined,
              position: newUserChannel.position + 1,
            });
            channel.permissionOverwrites.set(newUserChannel.permissionOverwrites.cache);
            this.tempChannels.push(channel);
            newVoice.setChannel(channel);
          }
        }
      }
    })
  }
  public getFirstGuild() {
    return this.client.guilds.cache.first();
  }
  public getGuilds() {
    return this.client.guilds.cache;
  }
  public on(event: string, callback: (...args: any[]) => Awaitable<void>) {
    return this.client.on(event, callback);
  }
  public async login(token: string) {
    return await this.client.login(token);
  }
}
