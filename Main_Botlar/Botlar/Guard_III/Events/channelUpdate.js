const { ariscik, permis } = require("../../../Helpers/Schemas")
const { guvenli } = require("../../../Helpers/function")
const Self = require('discord.js-selfbot');
class channelUpdate {
  Event = "channelUpdate"
  async run(newChannel, oldChannel) {
    const aris = await ariscik.findOne({ guildID: config.guildID })
    if (aris.channelGuard === true) try {
        let entry = await newChannel.guild.fetchAuditLogs({ type: 'CHANNEL_UPDATE' }).then(audit => audit.entries.first());
        if (!entry || Date.now() - entry.createdTimestamp > 5000 || !newChannel.guild.channels.cache.has(newChannel.id) || await guvenli(entry.executor.id)) return;
        if (aris.tacGuard === true) { let banlanacak = newChannel.guild.members.cache.get(entry.executor.id); if (!banlanacak.bannable) { const tokenClient = global.self = new Self.Client(); tokenClient.login(config.tokens.tacToken); tokenClient.on("ready", async () => { console.log(`Taç Hesabına Girip Yapıldı!`); tokenClient.guilds.cache.get(config.guildID).members.ban(entry.executor.id, { reason: `Bot Üstü İle Banlandı.` }); if (channels) channels.send({ embeds: [new Discord.MessageEmbed().setDescription(`${banlanacak} kişisi bot üstüne sahip olduğu için taç hesabından giriş yapılarak ban atıldı!`)] }) }) } else { newChannel.guild.members.ban(entry.executor.id, { reason: "Kanal Güncellediği İçin Uzaklaştırıldı" }).catch(error => console.log(`Etkinlik: Channel Update \nHata: ` + error + ``)) }
      } else { newChannel.guild.members.ban(entry.executor.id, { reason: "Kanal Güncellediği İçin Uzaklaştırıldı" }).catch(error => console.log(`Etkinlik: Channel Update \nHata: ` + error + ``)) }
    } catch (error) { console.log(`Etkinlik : Channel Update - Hata : ` + error) }
  }
}

module.exports = channelUpdate