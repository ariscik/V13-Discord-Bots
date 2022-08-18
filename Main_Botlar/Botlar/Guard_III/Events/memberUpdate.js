const { ariscik, permis } = require("../../../Helpers/Schemas")
const { guvenli } = require("../../../Helpers/function")
const Self = require('discord.js-selfbot');
class guildMemberUpdate {
    Event = "guildMemberUpdate"
    async run(newMember, oldMember) {
        const aris = await ariscik.findOne({ guildID: config.guildID })
        const yetkiPermleri = ["8", "268435456", "16", "536870912", "4", "2", "134217728", "1073741824", "536870912"];
        if (aris.roleGuard === true) try {
            let entry = await newMember.guild.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE' }).then(audit => audit.entries.first());
            if (!entry || Date.now() - entry.createdTimestamp > 5000 || await guvenli(entry.executor.id)) return;
            if (yetkiPermleri.some(p => !oldMember.permissions.has(p) && newMember.permissions.has(p))) {
                if (aris.tacGuard === true) {
                    let banlanacak = newMember.guild.members.cache.get(entry.executor.id); if (!banlanacak.bannable) { const tokenClient = global.self = new Self.Client(); tokenClient.login(config.tokens.tacToken); tokenClient.on("ready", async () => { console.log(`Taç Hesabına Girip Yapıldı!`); tokenClient.guilds.cache.get(config.guildID).members.ban(entry.executor.id, { reason: `Bot Üstü İle Banlandı.` }); if (channels) channels.send({ embeds: [new Discord.MessageEmbed().setDescription(`${banlanacak} kişisi bot üstüne sahip olduğu için taç hesabından giriş yapılarak ban atıldı!`)] }) }) } else { newMember.guild.members.ban(entry.executor.id, { reason: "Üyeye Yetki Verdiği İçin Uzaklaştırıldı!" }).catch(error => console.log(`Etkinlik: Member Update \nHata: ` + error + ``)) }
                } else { newMember.guild.members.ban(entry.executor.id, { reason: "Üyeye Yönetici Verdiği İçin Uzaklaştırıldı!" }).catch(error => console.log(`Etkinlik: Member Update \nHata: ` + error + ``)) }
                newMember.roles.set(oldMember.roles.cache.map(r => r.id));
            };
        } catch (error) { console.log(`Etkinlik : Member Update - Hata : ` + error) }
    }
}

module.exports = guildMemberUpdate