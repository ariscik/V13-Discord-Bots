const { ariscik, permis } = require("../../../Helpers/Schemas")
const { guvenli } = require("../../../Helpers/function")
class guildMemberUpdate {
    Event = "guildMemberUpdate"
    async run(newMember, oldMember) {
        const aris = await ariscik.findOne({ guildID: config.guildID })
        const yetkiPermleri = ["8", "268435456", "16", "536870912", "4", "2", "134217728", "1073741824", "536870912"];
        if (aris.roleGuard === true) try {
            let entry = await newMember.guild.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE' }).then(audit => audit.entries.first());
            if (!entry || Date.now() - entry.createdTimestamp > 5000 || await guvenli(entry.executor.id)) return;
            let islemyapan = newMember.guild.members.cache.get(entry.executor.id);
            if (yetkiPermleri.some(p => !oldMember.permissions.has(p) && newMember.permissions.has(p))) {
                newMember.roles.set(oldMember.roles.cache.map(r => r.id));
                const channels = client.channels.cache.get(aris.guardLog)
                if (!channels) return;
                const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId('yasakkaldir').setLabel("Yasağı Kaldır!").setStyle('PRIMARY'), new Discord.MessageButton().setCustomId('guvenliekle').setLabel("Güvenli Listeye Ekle!").setStyle('PRIMARY'), new Discord.MessageButton().setCustomId('ytleriac').setLabel("Yetkileri Tekrar Aç!").setStyle('DANGER'));
                let log = await channels.send({ content: `@everyone **Şüpheli İşlem Tespit Edildi!**\n\n**İŞLEM :** \`ÜYEYE YETKİ VERME İŞLEMİ!\`\n\n**Yetki Veren Kullanıcı: **${entry.executor} (\`${entry.executor.tag} - ${entry.executor.id}\`)\n**Yetki Verilen Üye: **${newMember} (\`${newMember.user.tag} - ${newMember.id}\`)\n\n**Yapılan İşlem :** ${islemyapan.bannable ? "Başarıyla yasaklandı" : "Yasaklanamadı"} - Yetkiyi Geri Aldım!`, components: [row] })
                var filter = (button) => config.Founders.some(x => x == button.user.id); const collector = log.createMessageComponentCollector({ filter }); collector.on('collect', async (button, user) => { const permisi = await permis.findOne({ guildID: config.guildID }); if (button.customId === "yasakkaldir") { button.guild.members.unban(entry.executor.id, ` Buton Üzerinden Kaldırıldı!`); button.reply(`Merhaba ${button.user}! ${entry.executor} kişisinin banı kaldırıldı!`) } if (button.customId === "guvenliekle") { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $push: { WhiteListMembers: entry.executor.id } }, { upsert: true }); button.reply(`Merhaba ${button.user}! Başarılı bir şekilde ${entry.executor} kişisini güvenli listeye ekledim!`) }; if (button.customId === "ytleriac") { button.reply(`Merhaba ${button.user}! Yetkileri tekrar açtım!`); permisi.roller.forEach((permission) => { const role = button.guild.roles.cache.get(permission.rol); if (role) role.setPermissions(permission.perm); }); } })
            };
        } catch (error) { console.log(`Etkinlik : Member Update - Hata : ` + error) }
    }
}

module.exports = guildMemberUpdate