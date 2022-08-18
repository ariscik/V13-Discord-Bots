const { ariscik } = require("../../../Helpers/Schemas")
class Ready {
  Event = "ready"
  async run() {
    setInterval(async () => {
      const aris = await ariscik.findOne({ guildID: config.guildID })
      const channel = client.channels.cache.get(aris.botVoiceChannel);
      voice.joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
    }, 600 * 1000);
  }
}

module.exports = Ready