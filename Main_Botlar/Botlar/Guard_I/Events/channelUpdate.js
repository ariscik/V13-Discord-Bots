const { ariscik, permis } = require("../../../Helpers/Schemas")
const { guvenli } = require("../../../Helpers/function")
class channelUpdate {
  Event = "channelUpdate"
  async run(newChannel, oldChannel) {
    const aris = await ariscik.findOne({ guildID: config.guildID })
    if (aris.channelGuard === true) try {
        let entry = await newChannel.guild.fetchAuditLogs({ type: 'CHANNEL_UPDATE' }).then(audit => audit.entries.first());
        if (!entry || Date.now() - entry.createdTimestamp > 5000 || !newChannel.guild.channels.cache.has(newChannel.id) || await guvenli(entry.executor.id)) return;
        let islemyapan = newChannel.guild.members.cache.get(entry.executor.id);
        const channels = client.channels.cache.get(aris.guardLog)
        if (!channels) return;
        const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId('yasakkaldir').setLabel("Yasağı Kaldır!").setStyle('PRIMARY'), new Discord.MessageButton().setCustomId('guvenliekle').setLabel("Güvenli Listeye Ekle!").setStyle('PRIMARY'), new Discord.MessageButton().setCustomId('ytleriac').setLabel("Yetkileri Tekrar Aç!").setStyle('DANGER'));
        let log = await channels.send({ content: `@everyone **Şüpheli İşlem Tespit Edildi!**\n\n**İŞLEM :** \`KANAL GÜNCELLEME İŞLEMİ!\`\n\n**Kanalı Güncelleyen Kullanıcı: **${entry.executor} (\`${entry.executor.tag} - ${entry.executor.id}\`)\n**Güncellenen Kanal: ** \`${oldChannel.name}\`\n\n**Yapılan İşlem :** ${islemyapan.bannable ? "Başarıyla yasaklandı" : "Yasaklanamadı"} - Kanalı eski haline getirdim!`, components: [row] })
        var filter = (button) => config.Founders.some(x => x == button.user.id); const collector = log.createMessageComponentCollector({ filter }); collector.on('collect', async (button, user) => { const permisi = await permis.findOne({ guildID: config.guildID }); if (button.customId === "yasakkaldir") { button.guild.members.unban(entry.executor.id, ` Buton Üzerinden Kaldırıldı!`); button.reply(`Merhaba ${button.user}! ${entry.executor} kişisinin banı kaldırıldı!`) } if (button.customId === "guvenliekle") { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $push: { WhiteListMembers: entry.executor.id } }, { upsert: true }); button.reply(`Merhaba ${button.user}! Başarılı bir şekilde ${entry.executor} kişisini güvenli listeye ekledim!`) }; if(button.customId === "ytleriac") { button.reply(`Merhaba ${button.user}! Yetkileri tekrar açtım!`); permisi.roller.forEach((permission) => { const role = button.guild.roles.cache.get(permission.rol); if (role) role.setPermissions(permission.perm); }); } })
    } catch (error) { console.log(`Etkinlik : Channel Update - Hata : ` + error) }
  }
}

module.exports = channelUpdate