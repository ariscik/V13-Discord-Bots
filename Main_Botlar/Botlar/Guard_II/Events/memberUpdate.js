const { ariscik, permis } = require("../../../Helpers/Schemas")
const { ytKapat, guvenli } = require("../../../Helpers/function")
class guildMemberUpdate {
    Event = "guildMemberUpdate"
    async run(newMember, oldMember) {
        const aris = await ariscik.findOne({ guildID: config.guildID })
        const yetkiPermleri = ["8", "268435456", "16", "536870912", "4", "2", "134217728", "1073741824", "536870912"];
        if (aris.roleGuard === true) try {
            let entry = await newMember.guild.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE' }).then(audit => audit.entries.first());
            if (!entry || Date.now() - entry.createdTimestamp > 5000 || await guvenli(entry.executor.id)) return;
            if (yetkiPermleri.some(p => !oldMember.permissions.has(p) && newMember.permissions.has(p))) {
                ytKapat(config.guildID)    
            };
        } catch (error) { console.log(`Etkinlik : Member Update - Hata : ` + error) }
    }
}

module.exports = guildMemberUpdate