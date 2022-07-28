import { VoiceBasedChannel, ChannelType, VoiceState, GuildBasedChannel } from 'discord.js';
export class VoiceEventHandler {
  private static tempChannels: VoiceBasedChannel[] = [];
  public static async handleVoiceStateUpdate(newVoice: VoiceState, oldVoice: VoiceState) {
    const newUserChannel = oldVoice.channel;
    const oldUserChannel = newVoice.channel;

    if (oldUserChannel !== newUserChannel) {
      if (oldUserChannel && VoiceEventHandler.tempChannels.includes(oldUserChannel)) {
        if (oldUserChannel.members.size === 0) {
          for (let i = 0; i < VoiceEventHandler.tempChannels.length; i++) {
            if (VoiceEventHandler.tempChannels[i] === oldUserChannel) {
              VoiceEventHandler.tempChannels.splice(i, 1);
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
          while (
            newVoice.guild.channels.cache.find((c: GuildBasedChannel) => c.name === replacement.replace('$', counter))
          ) {
            counter++;
          }
          const channel = await newVoice.guild.channels.create({
            name: replacement.replace('$', counter),
            type: ChannelType.GuildVoice,
            parent: newUserChannel.parent ?? undefined,
            position: newUserChannel.position + 1
          });
          try {
            await channel.permissionOverwrites.set(newUserChannel.permissionOverwrites.cache);
            /* eslint-disable-next-line */
          } catch {}

          VoiceEventHandler.tempChannels.push(channel);
          await newVoice.setChannel(channel);
        }
      }
    }
  }
}
