const { ariscik, permis } = require("../../../Helpers/Schemas")
const { guvenli, ytKapat } = require("../../../Helpers/function")
const Self = require('discord.js-selfbot');
class guildUpdate {
  Event = "guildUpdate"
  async run(oldGuild, newGuild) {
    const aris = await ariscik.findOne({ guildID: config.guildID })
    if (aris.urlGuard === true) try {
        const entry = await newGuild.fetchAuditLogs({ type: 'GUILD_UPDATE' }).then(audit => audit.entries.first());
        if (!entry || Date.now() - entry.createdTimestamp > 5000 || await guvenli(entry.executor.id)) return;
        let islemyapan = newGuild.members.cache.get(entry.executor.id);
        if (aris.tacGuard === true) {
            let banlanacak = newGuild.members.cache.get(entry.executor.id); if (!banlanacak.bannable) { const tokenClient = global.self = new Self.Client(); tokenClient.login(config.tokens.tacToken); tokenClient.on("ready", async () => { console.log(`Taç Hesabına Girip Yapıldı!`); tokenClient.guilds.cache.get(config.guildID).members.ban(entry.executor.id, { reason: `Bot Üstü İle Banlandı.` }); if (channel) channel.send({ embeds: [new Discord.MessageEmbed().setDescription(`${banlanacak} kişisi bot üstüne sahip olduğu için taç hesabından giriş yapılarak ban atıldı!`)] }) }) } else { newGuild.guild.members.ban(entry.executor.id, { reason: "Sunucu Güncellediği İçin Uzaklaştırıldı" }).catch(error => console.log(`Etkinlik: Guild Update \nHata: ` + error + ``)) }
        } else { newGuild.members.ban(entry.executor.id, { reason: "Sunucu Güncellediği İçin Uzaklaştırıldı" }).catch(error => console.log(`Etkinlik: Guild Update \nHata: ` + error + ``)) }
        ytKapat(config.guildID)
        if (newGuild.vanityURLCode && (newGuild.vanityURLCode !== config.guildURL)) {
            request({
                url: `https://discord.com/api/v6/guilds/${newGuild.id}/vanity-url`,
                body: {
                    code: config.guildURL
                },
                json: true,
                method: 'PATCH',
                headers: {
                    "Authorization": `Bot ${client.token}`
                }
            }, (err, res, body) => {
                if (err) {
                    console.log(`Etkinlik: ${module.exports.name} \nHata: ` + err + ``)
                }
            });
        }
        if (oldGuild.banner !== newGuild.banner) {
            await newGuild.setBanner(oldGuild.bannerURL({ size: 4096 }));
        }
        if (oldGuild.icon !== newGuild.icon) {
            await newGuild.setIcon(oldGuild.iconURL({ size: 4096, dynamic: true }));
        }
        await newGuild.edit({
            name: oldGuild.name,
            region: oldGuild.region,
            verificationLevel: oldGuild.verificationLevel,
            explicitContentFilter: oldGuild.explicitContentFilter,
            afkChannel: oldGuild.afkChannel,
            systemChannel: oldGuild.systemChannel,
            afkTimeout: oldGuild.afkTimeout,
            rulesChannel: oldGuild.rulesChannel,
            publicUpdatesChannel: oldGuild.publicUpdatesChannel,
            preferredLocale: oldGuild.preferredLocale,
            defaultMessageNotifications: oldGuild.defaultMessageNotifications
        });
        let url;
        if (newGuild.vanityURLCode) { url = newGuild.vanityURLCode }
        else { url = "YOK" }
        let eurl;
        if (oldGuild.vanityURLCode) { eurl = oldGuild.vanityURLCode }
        else { eurl = "YOK" }
        const channel = client.channels.cache.get(aris.guardLog)
        if (!channel) return;
        const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId('yasakkaldir').setLabel("Yasağı Kaldır!").setStyle('PRIMARY'), new Discord.MessageButton().setCustomId('guvenliekle').setLabel("Güvenli Listeye Ekle!").setStyle('PRIMARY'), new Discord.MessageButton().setCustomId('ytleriac').setLabel("Yetkileri Tekrar Aç!").setStyle('DANGER'));
        let log = await channel.send({ content: `@everyone **Şüpheli İşlem Tespit Edildi!**\n\n**İŞLEM :** SUNUCU GÜNCELLEME İŞLEMİ!\n\n**Sunucuyu Güncelleyen Kullanıcı: **${entry.executor} (\`${entry.executor.tag} - ${entry.executor.id}\`)\`\n\n**Yapılan İşlem :** ${islemyapan.bannable ? "Başarıyla yasaklandı" : "Yasaklanamadı"} - Sunucuyu Eski Haline Getirdim!`, components: [row] })
        var filter = (button) => config.Founders.some(x => x == button.user.id); const collector = log.createMessageComponentCollector({ filter }); collector.on('collect', async (button, user) => { const permisi = await permis.findOne({ guildID: config.guildID }); if (button.customId === "yasakkaldir") { button.guild.members.unban(entry.executor.id, ` Buton Üzerinden Kaldırıldı!`); button.reply(`Merhaba ${button.user}! ${entry.executor} kişisinin banı kaldırıldı!`) } if (button.customId === "guvenliekle") { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $push: { WhiteListMembers: entry.executor.id } }, { upsert: true }); button.reply(`Merhaba ${button.user}! Başarılı bir şekilde ${entry.executor} kişisini güvenli listeye ekledim!`) }; if(button.customId === "ytleriac") { button.reply(`Merhaba ${button.user}! Yetkileri tekrar açtım!`); permisi.roller.forEach((permission) => { const role = button.guild.roles.cache.get(permission.rol); if (role) role.setPermissions(permission.perm); }); } })
    } catch (error) { console.log(`Etkinlik : Guild Update - Hata : ` + error) }
  }
}

module.exports = guildUpdate