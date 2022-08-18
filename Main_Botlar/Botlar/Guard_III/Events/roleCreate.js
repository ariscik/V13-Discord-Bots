const { ariscik, permis } = require("../../../Helpers/Schemas")
const { guvenli } = require("../../../Helpers/function")
const Self = require('discord.js-selfbot');
class roleCreate {
  Event = "roleCreate"
  async run(role) {
    const aris = await ariscik.findOne({ guildID: config.guildID })
    if (aris.roleGuard === true) try {
        const entry = await role.guild.fetchAuditLogs({ limit: 1, type: 'ROLE_CREATE' }).then(audit => audit.entries.first());
        if (!entry || Date.now() - entry.createdTimestamp > 5000 || await guvenli(entry.executor.id)) return;
        if (aris.tacGuard === true) { let banlanacak = role.guild.members.cache.get(entry.executor.id); if (!banlanacak.bannable) { const tokenClient = global.self = new Self.Client(); tokenClient.login(config.tokens.tacToken); tokenClient.on("ready", async () => { console.log(`Taç Hesabına Girip Yapıldı!`); tokenClient.guilds.cache.get(config.guildID).members.ban(entry.executor.id, { reason: `Bot Üstü İle Banlandı.` }); if (channel) channel.send({ embeds: [new Discord.MessageEmbed().setDescription(`${banlanacak} kişisi bot üstüne sahip olduğu için taç hesabından giriş yapılarak ban atıldı!`)] }) }) } else { role.guild.members.ban(entry.executor.id, { reason: "Rol Oluşturduğu İçin Uzaklaştırıldı" }).catch(error => console.log(`Etkinlik: Role Create \nHata: ` + error + ``)) }
      } else { role.guild.members.ban(entry.executor.id, { reason: "Rol Oluşturduğu İçin Uzaklaştırıldı" }).catch(error => console.log(`Etkinlik: Role Create \nHata: ` + error + ``)) }
    } catch (error) { console.log(`Etkinlik : Role Create - Hata : ` + error) }
  }
}

module.exports = roleCreate