const { ariscik, Penalties } = require('../../../../Helpers/Schemas')
class Sicil extends Command {
    constructor(client) {
        super(client, {
            name: "sicil",
            aliases: ["gecmis", "cezalar", "cezalarım"],
            cooldown: 15
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!message.member.roles.cache.has(aris.muteHammer) && !config.Founders.includes(message.author.id) && !config.root.includes(message.author.id) && !aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)] }).sil(15)
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]); if (!member) return message.reply({ embeds: [embed.setDescription(`**UYARI : **Bir üye belirtmeyi unuttun!`)] }).sil(10)
        const uye = message.guild.members.cache.get(member.id)
        const sicil = await Penalties.find({ guildID: message.guild.id, userID: member.id, }).sort({ date: -1 })
        const sicilPanel = sicil.length > 0 ? sicil.slice(0, 10).map((value, index) => `\`#${value.id}\` **[${value.Ceza}]** ${new Date(value.Zaman).toTurkishFormatDate()} Tarihinde **${value.Sebep}** nedeniyle ${message.guild.members.cache.has(value.Yetkili) ? message.guild.members.cache.get(value.Yetkili) : value.Yetkili} tarafından sicile işlendi`).join("\n") : "Bu Kullanıcının Sicili Temiz!";
        await message.reply({ embeds: [embed.setThumbnail(member.avatarURL({ dynamic: true })).setDescription(`${uye ? uye.toString() : `**${member.username}**`} **İsimli Üyenin Geçmiş 10 Sicil Bilgileri**\n\n ${sicilPanel}`)] }).sil(60)
    }
}

module.exports = Sicil