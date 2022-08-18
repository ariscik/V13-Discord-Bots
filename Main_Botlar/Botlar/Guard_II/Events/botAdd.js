const { ariscik, permis } = require("../../../Helpers/Schemas")
const { ytKapat, guvenli } = require("../../../Helpers/function")
class guildMemberAdd {
  Event = "guildMemberAdd"
  async run(member) {
    const aris = await ariscik.findOne({ guildID: config.guildID })
    if (aris.serverGuard === true) try {
        const entry = await member.guild.fetchAuditLogs({ type: 'BOT_ADD' }).then(audit => audit.entries.first());
        if (!entry || Date.now() - entry.createdTimestamp > 5000 || await guvenli(entry.executor.id)) return;
        ytKapat(config.guildID)
      } catch (error) { console.log(`Etkinlik : Bot Add - Hata : ` + error) }
  }
}

module.exports = guildMemberAdd