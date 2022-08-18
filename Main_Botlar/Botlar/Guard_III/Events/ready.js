const { ariscik } = require("../../../Helpers/Schemas")
const Backup = require("../../../Helpers/Backup")
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
    Backup.channelBackup();
    setInterval(() => {
      Backup.channelBackup();
    }, 1000 * 60 * 60 * 1);
  }
}

module.exports = Ready