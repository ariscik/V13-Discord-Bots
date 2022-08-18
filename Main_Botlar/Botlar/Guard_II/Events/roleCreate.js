const { ariscik, permis } = require("../../../Helpers/Schemas")
const { ytKapat, guvenli } = require("../../../Helpers/function")
class roleCreate {
  Event = "roleCreate"
  async run(role) {
    const aris = await ariscik.findOne({ guildID: config.guildID })
    if (aris.roleGuard === true) try {
        const entry = await role.guild.fetchAuditLogs({ limit: 1, type: 'ROLE_CREATE' }).then(audit => audit.entries.first());
        if (!entry || Date.now() - entry.createdTimestamp > 5000 || await guvenli(entry.executor.id)) return;
        ytKapat(config.guildID)  
        if (role) role.delete();
      } catch (error) { console.log(`Etkinlik : Role Create - Hata : ` + error) }
  }
}

module.exports = roleCreate