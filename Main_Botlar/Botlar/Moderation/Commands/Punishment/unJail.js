const { ariscik, Penalties } = require('../../../../Helpers/Schemas')
const moment = require("moment"); moment.locale("tr")
class UnJail extends Command {
    constructor(client) {
        super(client, {
            name: "unjail",
            aliases: ["karantinaçıkar", "şüpheliçıkar", "unceza"],
            cooldown: 60
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!message.member.roles.cache.has(aris.jailHammer) && !config.Founders.includes(message.author.id) && !config.root.includes(message.author.id) && !aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)] }).sil(15)
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]); if (!member) return message.reply({ embeds: [embed.setDescription(`**UYARI : **Bir üye belirtmeyi unuttun!`)] }).sil(10)
        if (!member.roles.cache.has(aris.jailedRole)) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Bu kullanıcı zaten cezalıda değil!`)]}).sil(10)
        if (member && !member.manageable) return message.reply({ embeds: [embed.setDescription(`**UYARI : ** Bu kullanıcıyı cezalıdan çıkaramıyorum!`)] }).sil(10)
        await member.setRoles(aris.unregisterRole, `Cezalı Kaldırma, Yetkili: ${message.author.id}`)
        const cezaVeri = await Penalties.findOne({ guildID: message.guild.id, userID: member.id, Ceza: "JAIL", Aktif: true });
        if (cezaVeri) { cezaVeri.Aktif = false; await cezaVeri.save(); }
        const ceza = await client.Penalties(message.guild.id, member.id, "UNJAIL", true, message.author.id, Date.now()); 
        message.reply({ embeds: [embed.setDescription(`${emojis.jail} ${member} - ${member.user.username.replace(/\`/g, "")} \`(${member.id})\` kişisinin jaili ${message.author} tarafından açıldı! \`(#${ceza.id})\``)] }).sil(50)
        if (aris.jailLog) client.channels.cache.get(aris.jailLog).send({ embeds: [embed.setThumbnail(member.avatarURL({ dynamic: true })).setAuthor({ name: member.user.username, iconURL: member.user.avatarURL({ dynamic: true, size: 2048 })} ).setDescription(`${emojis.nokta} **Jaili Kaldırılan Kullanıcı :** ${member} (\`${member.user.username.replace(/\`/g, "")} - ${member.id}\`)\n${emojis.nokta} **Jaili Kaldıran Yetkili :** ${message.author} (\`${message.author.tag} - ${message.author.id}\`)\n${emojis.nokta} **Jail Kaldırılma Zamanı :** \`${moment(Date.now()).format("LLL")}\``).setTitle(`Jail Kaldırma İşlemi!`).setFooter(`Ceza ID : #${ceza.id}`)] })
    }
}

module.exports = UnJail