const { ariscik, permis } = require("../../../Helpers/Schemas")
const { guvenli } = require("../../../Helpers/function")
class guildMemberRemove {
  Event = "guildMemberRemove"
  async run(member) {
    const aris = await ariscik.findOne({ guildID: config.guildID })
    if (aris.serverGuard === true) try {
        let entry = await member.guild.fetchAuditLogs({ type: 'MEMBER_KICK' }).then(audit => audit.entries.first());
        if (!entry || Date.now() - entry.createdTimestamp > 5000 || await guvenli(entry.executor.id)) return;
        let islemyapan = member.guild.members.cache.get(entry.executor.id);
        const channels = client.channels.cache.get(aris.guardLog)
        if (!channels) return;
        const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId('cezalikaldır').setLabel("Cezalı Kaldır!").setStyle('PRIMARY'), new Discord.MessageButton().setCustomId('guvenliekle').setLabel("Güvenli Listeye Ekle!").setStyle('PRIMARY'), new Discord.MessageButton().setCustomId('ytleriac').setLabel("Yetkileri Tekrar Aç!").setStyle('DANGER'));
        let log = await channels.send({ content: `@everyone **Şüpheli İşlem Tespit Edildi!**\n\n**İŞLEM :** \`İZİNSİZ ÜYE KİCKLEME İŞLEMİ!\`\n\n**Üye Kickleyen Kullanıcı: **${entry.executor} (\`${entry.executor.tag} - ${entry.executor.id}\`)\n**Kicklenen Üye: **${member} (\`${member.user.tag} - ${member.user.id}\`)\n\n**Yapılan İşlem :** ${islemyapan.manageable ? "Başarıyla cezalıya atıldı" : "Cezalıya Atılamadı"} - Kişiyi cezalıya attım!`, components: [row] })
        var filter = (button) => config.Founders.some(x => x == button.user.id); const collector = log.createMessageComponentCollector({ filter }); collector.on('collect', async (button, user) => { const permisi = await permis.findOne({ guildID: config.guildID }); if (button.customId === "cezalikaldır") { islemyapan.roles.set([aris.unregisterRole], `Buton üzerinden cezalıdan çıkarıldı!`); button.reply(`Merhaba ${button.user}! ${entry.executor} kişisinin cezası kaldırıldı!`) } if (button.customId === "guvenliekle") { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $push: { WhiteListMembers: entry.executor.id } }, { upsert: true }); button.reply(`Merhaba ${button.user}! Başarılı bir şekilde ${entry.executor} kişisini güvenli listeye ekledim!`) }; if(button.customId === "ytleriac") { button.reply(`Merhaba ${button.user}! Yetkileri tekrar açtım!`); permisi.roller.forEach((permission) => { const role = button.guild.roles.cache.get(permission.rol); if (role) role.setPermissions(permission.perm); }); } })
    } catch (error) { console.log(`Etkinlik : Kick Add - Hata : ` + error) }
  }
}

module.exports = guildMemberRemove