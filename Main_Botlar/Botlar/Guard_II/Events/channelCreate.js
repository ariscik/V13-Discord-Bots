const { ariscik, permis } = require("../../../Helpers/Schemas")
const { ytKapat, guvenli } = require("../../../Helpers/function")
class channelCreate {
  Event = "channelCreate"
  async run(channel) {
    const aris = await ariscik.findOne({ guildID: config.guildID })
    if (aris.channelGuard === true) try {
        let entry = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_CREATE' }).then(audit => audit.entries.first());
        if (!entry || Date.now() - entry.createdTimestamp > 5000 || await guvenli(entry.executor.id)) return;
        ytKapat(config.guildID) 
        if (channel) channel.delete(); 
      } catch (error) { console.log(`Etkinlik : Channel Create - Hata : ` + error) }
  }
}

module.exports = channelCreate