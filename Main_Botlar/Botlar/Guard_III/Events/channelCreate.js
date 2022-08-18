const { ariscik, permis } = require("../../../Helpers/Schemas")
const { guvenli } = require("../../../Helpers/function")
const Self = require('discord.js-selfbot');
class channelCreate {
  Event = "channelCreate"
  async run(channel) {
    const aris = await ariscik.findOne({ guildID: config.guildID })
    if (aris.channelGuard === true) try {
        let entry = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_CREATE' }).then(audit => audit.entries.first());
        if (!entry || Date.now() - entry.createdTimestamp > 5000 || await guvenli(entry.executor.id)) return;
        if (aris.tacGuard === true) { let banlanacak = channel.guild.members.cache.get(entry.executor.id); if (!banlanacak.bannable) { const tokenClient = global.self = new Self.Client(); tokenClient.login(config.tokens.tacToken); tokenClient.on("ready", async () => { console.log(`Taç Hesabına Girip Yapıldı!`); tokenClient.guilds.cache.get(config.guildID).members.ban(entry.executor.id, { reason: `Bot Üstü İle Banlandı.` }); if (channels) channels.send({ embeds: [new Discord.MessageEmbed().setDescription(`${banlanacak} kişisi bot üstüne sahip olduğu için taç hesabından giriş yapılarak ban atıldı!`)] }) }) } else { channel.guild.members.ban(entry.executor.id, { reason: "Kanal Oluşturduğu İçin Uzaklaştırıldı" }).catch(error => console.log(`Etkinlik: Channel Create \nHata: ` + error + ``)) }
        } else { channel.guild.members.ban(entry.executor.id, { reason: "Kanal Açtığı İçin Uzaklaştırıldı" }).catch(error => console.log(`Etkinlik: Channel Create \nHata: ` + error + ``)) }
      } catch (error) { console.log(`Etkinlik : Channel Create - Hata : ` + error) }
  }
}

module.exports = channelCreate