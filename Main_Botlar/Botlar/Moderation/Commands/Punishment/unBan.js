const { ariscik, Penalties } = require('../../../../Helpers/Schemas')
const moment = require("moment"); moment.locale("tr")
class UnBan extends Command {
    constructor(client) {
        super(client, {
            name: "unban",
            aliases: ["yasakkaldır", "unyasak"],
            cooldown: 60
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!message.member.roles.cache.has(aris.banHammer) && !config.Founders.includes(message.author.id) && !config.root.includes(message.author.id) && !aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)] }).sil(15)
        const member = message.mentions.users.first() || await client.fetchUser(args[0]); if (!member) return message.reply({ embeds: [embed.setDescription(`**UYARI : **Bir üye belirtmeyi unuttun!`)] }).sil(10)
        const banned = await client.fetchBan(message.guild, args[0]); if (!banned) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Bu kullanıcı bu sunucuda banlı değil!`)] }).sil(10)
        const uye = await client.fetchUser(args[0]);
        message.guild.members.unban(uye, `Yetkili : ${message.author.id}` )
        const cezaVeri = await Penalties.findOne({ guildID: message.guild.id, userID: uye.id, Ceza: "BAN", Aktif: true });
        if (cezaVeri) { cezaVeri.Aktif = false; await cezaVeri.save(); }
        const ceza = await client.Penalties(message.guild.id, uye.id, "UNBAN", true, message.author.id, Date.now()); 
        message.reply({ embeds: [embed.setDescription(`${emojis.ban} ${uye} - ${member.username} \`(${uye.id})\` kişisinin banı ${message.author} tarafından açıldı! \`(#${ceza.id})\``)] }).sil(50)
        if (aris.banLog) client.channels.cache.get(aris.banLog).send({ embeds: [embed.setDescription(`${emojis.nokta} **Banı Kaldırılan Kullanıcı :** ${member} (\`${member.username} - ${member.id}\`)\n${emojis.nokta} **Banı Kaldıran Yetkili :** ${message.author} (\`${message.author.tag} - ${message.author.id}\`)\n${emojis.nokta} **Ban Kaldırılma Zamanı :** \`${moment(Date.now()).format("LLL")}\``).setTitle(`Ban Kaldırma İşlemi!`).setFooter(`Ceza ID : #${ceza.id}`)] })
    }
}

module.exports = UnBan