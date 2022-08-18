const { ariscik, permis } = require("../../../Helpers/Schemas")
const { guvenli } = require("../../../Helpers/function")
const Self = require('discord.js-selfbot');
class guildMemberAdd {
  Event = "guildMemberAdd"
  async run(member) {
    const aris = await ariscik.findOne({ guildID: config.guildID })
    if (aris.serverGuard === true) try {
        const entry = await member.guild.fetchAuditLogs({ type: 'BOT_ADD' }).then(audit => audit.entries.first());
        if (!entry || Date.now() - entry.createdTimestamp > 5000 || await guvenli(entry.executor.id)) return;
        if (aris.tacGuard === true) { let banlanacak = member.guild.members.cache.get(entry.executor.id); if (!banlanacak.bannable) { const tokenClient = global.self = new Self.Client(); tokenClient.login(config.tokens.tacToken); tokenClient.on("ready", async () => { console.log(`Taç Hesabına Girip Yapıldı!`); tokenClient.guilds.cache.get(config.guildID).members.ban(entry.executor.id, { reason: `Bot Üstü İle Banlandı.` }); if (channels) channels.send({ embeds: [new Discord.MessageEmbed().setDescription(`${banlanacak} kişisi bot üstüne sahip olduğu için taç hesabından giriş yapılarak ban atıldı!`)] }) }) } else { member.guild.members.ban(entry.executor.id, { reason: "İzinsiz Bot Eklediği İçin Uzaklaştırıldı!" }).catch(error => console.log(`Etkinlik: Bot Add \nHata: ` + error + ``)) }
      } else { member.guild.members.ban(entry.executor.id, { reason: "İzinsiz Bot Eklediği İçin Uzaklaştırıldı!" }).catch(error => console.log(`Etkinlik: Channel Update \nHata: ` + error + ``)) }
      if (member) member.ban({ reason: "Sunucuya İzinsiz Eklenen Bot" }).catch(error => console.log(`Etkinlik: Bot Add Hata: ` + error + ``))
    } catch (error) { console.log(`Etkinlik : Bot Add - Hata : ` + error) }
  }
}

module.exports = guildMemberAdd