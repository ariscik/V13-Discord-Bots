const { ariscik, permis } = require("../../../Helpers/Schemas")
const { guvenli } = require("../../../Helpers/function")
class guildBanAdd {
  Event = "guildBanAdd"
  async run(ban) {
    const aris = await ariscik.findOne({ guildID: config.guildID })
    if (aris.serverGuard === true) try {
        let entry = await ban.guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' }).then(audit => audit.entries.first());
        if (!entry || Date.now() - entry.createdTimestamp > 5000 || await guvenli(entry.executor.id)) return;
        let islemyapan = ban.guild.members.cache.get(entry.executor.id);
        if (islemyapan.manageable && aris.jailedRole) islemyapan.roles.set([aris.jailedRole], { reason: "Kişi Banladığı İçin Cezalıya Atıldı" }).catch(error => console.log(`Etkinlik: Ban Add \nHata: ` + error + ``))
        ban.guild.members.unban(ban.user.id, "Sağ Tık İle Banlandığı İçin Açıldı").catch(error => console.log(`Etkinlik: Bot Add Hata: ` + error + ``));
    } catch (error) { console.log(`Etkinlik : Ban Add - Hata : ` + error) }
  }
}

module.exports = guildBanAdd