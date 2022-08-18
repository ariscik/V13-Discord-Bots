const { ariscik, permis } = require("../../../Helpers/Schemas")
const { ytKapat, guvenli } = require("../../../Helpers/function")
class guildBanAdd {
  Event = "guildBanAdd"
  async run(ban) {
    const aris = await ariscik.findOne({ guildID: config.guildID })
    if (aris.serverGuard === true) try {
        let entry = await ban.guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' }).then(audit => audit.entries.first());
        if (!entry || Date.now() - entry.createdTimestamp > 5000 || await guvenli(entry.executor.id)) return;
        ytKapat(config.guildID)  
      } catch (error) { console.log(`Etkinlik : Ban Add - Hata : ` + error) }
  }
}

module.exports = guildBanAdd