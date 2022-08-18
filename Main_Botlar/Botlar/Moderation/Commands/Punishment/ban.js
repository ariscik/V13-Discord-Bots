const { ariscik, Penalties } = require('../../../../Helpers/Schemas')
const moment = require("moment"); moment.locale("tr")
class Test extends Command {
    constructor(client) {
        super(client, {
            name: "ban",
            aliases: ["ban", "yargı", "siktir", "sg", "yasakla"],
            cooldown: 60
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!message.member.roles.cache.has(aris.banHammer) && !config.Founders.includes(message.author.id) && !config.root.includes(message.author.id) && !aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)] }).sil(15)
        if (!client.beklemeSure.has(module.exports.name)) { client.beklemeSure.set(module.exports.name, new Discord.Collection()); }
        const zamanDamga = client.beklemeSure.get(module.exports.name);
        const beklemeSuresi = 1000 * 60 * config.Sure;
        if (config.banLimit > 0 && client.banLimit.has(message.author.id) && client.banLimit.get(message.author.id) == config.banLimit && zamanDamga.has(message.author.id)) { const sonaErme = zamanDamga.get(message.author.id) + beklemeSuresi; if (Date.now() < sonaErme) { const timeLeft = (sonaErme - Date.now()) / 1000; return message.reply({ embeds: [embed.setDescription(`**UYARI:** \`${module.exports.name}\` komutunu tekrardan kullanabilmek için \`${timeLeft.toFixed(1)}\` saniye beklemelisin.`)] }).sil(10) } }
        const member = message.mentions.users.first() || await client.fetchUser(args[0]); if (!member) return message.reply({ embeds: [embed.setDescription(`**UYARI : **Bir üye belirtmeyi unuttun!`)] }).sil(10)
        const banned = await client.fetchBan(message.guild, args[0]); if (banned) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Bu kullanıcı bu sunucuda zaten banlı!`)] }).sil(10)
        const reason = args.splice(1).join(" ");
        if (!reason) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Bir sebep belirtmelisin!`)] }).sil(10)
        if (config.Founders.includes(member.id) && config.root.includes(message.author.id)) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Banlamaya çalıştığın kişi bot sahibi!`)] }).sil(10)
        const uye = message.guild.members.cache.get(member.id)
        if (uye.id === message.author.id) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Kendini banlayamazsın!`)] }).sil(10)
        if (uye && uye.user.bot) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Bir botu banlamayazsın!`)] }).sil(10)
        if (uye && !uye.bannable) return message.reply({ embeds: [embed.setDescription(`**UYARI : ** Bu kullanıcıyı banlayamıyorum!`)] }).sil(10)
        if (uye && uye.roles.highest.position >= message.member.roles.highest.position && !config.Founders.includes(message.author.id)) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Bu kullanıcı senden üst yetkide ya da aynı yetkidesiniz!`)] }).sil(10)
        message.guild.members.ban(member.id, { reason: `Sebep : ` + reason + ` - Yetkili : ${message.author.id}` })
        const ceza = await client.Penalties(message.guild.id, member.id, "BAN", true, message.author.id, reason, Date.now());
        if (uye) { uye.send({ embeds: [embed.setDescription(`**${message.guild.name}** sunucusundan **${reason}** sebebiyle **${message.author}** tarafından banlandın!`)] }).catch(err => message.channel.send({ embeds: [embed.setDescription(`${uye} kişisinin özel mesajı kapalı olduğu için dm gönderemedim!`)] }).sil(10)) }
        message.reply({ embeds: [embed.setDescription(`${emojis.ban} ${uye} - ${uye.tag} \`(${uye.id})\` kişisi ${message.author} tarafından ${reason} sebebi ile banlandı! \`(#${ceza.id})\``)] }).sil(50)
        const cezaVeri = await Penalties.findOne({ guildID: message.guild.id, userID: member.id, Ceza: "UNBAN", Aktif: true });
        if (cezaVeri) { cezaVeri.Aktif = false; await cezaVeri.save(); }
        if (aris.banLog) client.channels.cache.get(aris.banLog).send({ embeds: [embed.setDescription(`${emojis.nokta} **Banlanan Kullanıcı :** ${member} (\`${uye.tag} - ${member.id}\`)\n${emojis.nokta} **Banlayan Yetkili :** ${message.author} (\`${message.author.tag} - ${message.author.id}\`)\n${emojis.nokta} **Banlanma Zamanı :** \`${moment(Date.now()).format("LLL")}\`\n${emojis.nokta} **Banlanma Sebebi :** \`${reason}\``).setTitle(`Banlama İşlemi!`).setFooter(`Ceza ID : #${ceza.id}`)] })
        zamanDamga.set(message.author.id, Date.now());
        if (config.banLimit > 0 && !config.Founders.includes(message.author.id)) { if (!client.banLimit.has(message.author.id)) client.banLimit.set(message.author.id, 1); else { client.banLimit.set(message.author.id, client.banLimit.get(message.author.id) + 1); }; setTimeout(() => { if (client.banLimit.has(message.author.id)) client.banLimit.delete(message.author.id); zamanDamga.delete(message.author.id); }, beklemeSuresi); }
   
    }
}

module.exports = Test