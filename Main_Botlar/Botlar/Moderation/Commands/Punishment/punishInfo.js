const { ariscik, Penalties } = require('../../../../Helpers/Schemas')
class PInfo extends Command {
    constructor(client) {
        super(client, {
            name: "cezabilgi",
            aliases: ["cezainfo", "cezano", "cezasorgu"],
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!message.member.roles.cache.has(aris.muteHammer) && !config.Founders.includes(message.author.id) && !config.root.includes(message.author.id) && !aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)] }).sil(15)
        if (!args[0]) return message.reply({ embeds: [embed.setDescription(`**UYARI : **Lütfen geçerli bir ceza numarası belirtin!`)] }).sil(10)
        if (isNaN(args[0])) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Lütfen geçerli bir ceza numarası belirtin!`)] }).sil(10)
        const ceza = await Penalties.findOne({ guildID: message.guild.id, id: args[0] });
        if (!ceza) return message.reply({ embeds: [embed.addField("**UYARI : **", ` (\`#${args[0]}\`) numaralı ceza bulunamadı!`)] }).sil(30)
        const cSure = ceza.Sure || `-`;
        const yetkili = await client.fetchUser(ceza.Yetkili);
        const uye = await client.fetchUser(ceza.userID);
        message.reply({ embeds: [embed.setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setThumbnail(message.guild.iconURL({ dynamic: true })).setDescription(`**#${ceza.id}** ID'li cezanın bilgileri;\n**» Ceza Numarası:** \`#${ceza.id}\`\n**» Ceza Tipi:** \`${ceza.Ceza}\`\n**» Ceza Zamanı:** \`${new Date(ceza.Zaman).toTurkishFormatDate()}\`\n**» Ceza Uygulayan:** ${yetkili.tag} (\`${yetkili.id}\`)\n**» Ceza Alan:** ${uye.tag} (\`${uye.id}\`)\n**» Ceza Sebebi:** \`${ceza.Sebep}\`\n**» Ceza Süresi:** \`${cSure}\`\n`).setTimestamp().setColor("RANDOM")]}).sil(60)
    }
}

module.exports = PInfo