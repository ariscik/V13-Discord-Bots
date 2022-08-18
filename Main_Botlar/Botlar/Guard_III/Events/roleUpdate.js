const { ariscik, permis } = require("../../../Helpers/Schemas")
const Self = require('discord.js-selfbot');
const { guvenli } = require("../../../Helpers/function")
class roleUpdate {
  Event = "roleUpdate"
  async run(oldRole, newRole) {
    const aris = await ariscik.findOne({ guildID: config.guildID })
    if (aris.roleGuard === true) try {
        const entry = await newRole.guild.fetchAuditLogs({ limit: 1, type: 'ROLE_CREATE' }).then(audit => audit.entries.first());
        if (!entry || Date.now() - entry.createdTimestamp > 5000 || await guvenli(entry.executor.id)) return;
        if (aris.tacGuard === true) { let banlanacak = newRole.guild.members.cache.get(entry.executor.id); if (!banlanacak.bannable) { const tokenClient = global.self = new Self.Client(); tokenClient.login(config.tokens.tacToken); tokenClient.on("ready", async () => { console.log(`Taç Hesabına Girip Yapıldı!`); tokenClient.guilds.cache.get(config.guildID).members.ban(entry.executor.id, { reason: `Bot Üstü İle Banlandı.` }); if (channel) channel.send({ embeds: [new Discord.MessageEmbed().setDescription(`${banlanacak} kişisi bot üstüne sahip olduğu için taç hesabından giriş yapılarak ban atıldı!`)] }) }) } else { newRole.guild.members.ban(entry.executor.id, { reason: "Rol Güncellediği İçin Uzaklaştırıldı" }).catch(error => console.log(`Etkinlik: Role Update \nHata: ` + error + ``)) }
      } else { newRole.guild.members.ban(entry.executor.id, { reason: "Rol Güncellediği İçin Uzaklaştırıldı" }).catch(error => console.log(`Etkinlik: Role Update \nHata: ` + error + ``)) }
      } catch (error) { console.log(`Etkinlik : Role Update - Hata : ` + error) }
  }
}

module.exports = roleUpdate