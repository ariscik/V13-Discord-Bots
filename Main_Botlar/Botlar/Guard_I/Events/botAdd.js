const { ariscik } = require("../../../Helpers/Schemas")
const { guvenli } = require("../../../Helpers/function")
class guildMemberAdd {
  Event = "guildMemberAdd"
  async run(member) {
    const aris = await ariscik.findOne({ guildID: config.guildID })
    if (aris.serverGuard === true) try {
        const entry = await member.guild.fetchAuditLogs({ type: 'BOT_ADD' }).then(audit => audit.entries.first());
        if (!entry || Date.now() - entry.createdTimestamp > 5000 || await guvenli(entry.executor.id)) return;
        let islemyapan = member.guild.members.cache.get(entry.executor.id);
        const channels = client.channels.cache.get(aris.guardLog)
        if (!channels) return;
        const row = new Discord.MessageActionRow().addComponents( new Discord.MessageButton().setCustomId('yasakkaldir').setLabel("Yasağı Kaldır!").setStyle('PRIMARY'), new Discord.MessageButton().setCustomId('guvenliekle').setLabel("Güvenli Listeye Ekle!").setStyle('PRIMARY'), new Discord.MessageButton().setCustomId('botbanac').setLabel("Botun Banını Aç!").setStyle('PRIMARY') );
        let log = await channels.send({ content: `@everyone **Şüpheli İşlem Tespit Edildi!**\n\n**İŞLEM :** \`İZİNSİZ BOT EKLEME İŞLEMİ!\`\n\n**Bot Ekleyen Kullanıcı: **${entry.executor} (\`${entry.executor.tag} - ${entry.executor.id}\`)\n**Eklenen Bot: ** ${member} \`${member.id}\`\n\n**Yapılan İşlem :** ${islemyapan.bannable ? "Başarıyla yasaklandı" : "Yasaklanamadı"} - Botu Banladım!`, components: [row] })
        const collector = log.createMessageComponentCollector({  }); collector.on('collect', async (button, user) => { if(button.customId === "yasakkaldir") { button.guild.members.unban(entry.executor.id, ` Buton Üzerinden Kaldırıldı!` ); button.reply(`Merhaba ${button.user}! ${entry.executor} kişisinin banı kaldırıldı!`) } if(button.customId === "guvenliekle") { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $push: { WhiteListMembers: entry.executor.id } }, { upsert: true }); button.reply(`Merhaba ${button.user}! Başarılı bir şekilde ${entry.executor} kişisini güvenli listeye ekledim!`) }; if (button.customId === "botbanac") { button.reply(`Merhaba ${button.user}! ${member} adlı botun banı başarılı bir şekilde açıldı!`); button.guild.members.unban(member.id, ` Buton Üzerinden Bot Banı Kaldırıldı!` ); }  })
    } catch (error) { console.log(`Etkinlik : Bot Add - Hata : ` + error) }
  }
}

module.exports = guildMemberAdd