const { ariscik } = require('../../../../Helpers/Schemas')
class RAddRemove extends Command {
    constructor(client) {
        super(client, {
            name: "rol",
            aliases: ["rol", "r"],
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!config.Founders.includes(message.author.id) && !config.root.includes(message.author.id) && !aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)] }).sil(15)
        if (!args[0]) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Bir argüman belirtmelisin. \`Ver-Al\`!`)] }).sil(20)
        if (args[0].toLowerCase() === "ver") {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
            if (!member) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir üye belirtmeyi unuttun!`)] }).sil(20)
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
            if (!role) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir rol belirtmelisin!`)] }).sil(20)
            if (role.position >= message.member.roles.highest.position) return message.reply({ embeds: [embed.setDescription(`**UYARI: **Yetkinden yüksek yetkileri veremezsin!`)] }).sil(20)
            if (!role.editable) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu rol üzerinde işlem yapmak için yetkim yetersiz.`)] }).sil(20)
            if (member.roles.cache.has(role.id)) return message.channel.send({ embeds: [embed.setDescription(`Bu üyede zaten bu rol mevcut!`)] }).sil(20)
            member.roles.add(role.id)
            message.react(emojis.onay)
            message.reply({ embeds: [embed.setDescription(`Başarılı! ${member} kişisine ${message.author} tarafından ${role} rolü verildi!`)] }).sil(60)
            client.channels.cache.get(aris.denetimLog).send({ embeds: [embed.setDescription(`${member} - ${member.id} kişisine ${message.author} - ${message.author.id} kişisi tarafından ${role} rolü verildi!`).setTimestamp()] })
        } else if (args[0].toLowerCase() === "al") {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
            if (!member) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir üye belirtmeyi unuttun!`)] }).sil(20)
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
            if (!role) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir rol belirtmelisin!`)] }).sil(20)
            if (role.position >= message.member.roles.highest.position) return message.reply({ embeds: [embed.setDescription(`**UYARI: **Yetkinden yüksek yetkileri veremezsin!`)] }).sil(20)
            if (!role.editable) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu rol üzerinde işlem yapmak için yetkim yetersiz.`)] }).sil(20)
            if (!member.roles.cache.has(role.id)) return message.channel.send({ embeds: [embed.setDescription(`Bu üyede zaten bu rol mevcut değil!`)] }).sil(20)
            member.roles.remove(role.id)
            message.react(emojis.onay)
            message.reply({ embeds: [embed.setDescription(`Başarılı! ${member} kişisinden ${message.author} tarafından ${role} rolü alındı!`)] }).sil(60)
            client.channels.cache.get(aris.denetimLog).send({ embeds: [embed.setDescription(`${member} - ${member.id} kişisinden ${message.author} - ${message.author.id} kişisi tarafından ${role} rolü alındı!`).setTimestamp()] })
        }
    }
}

module.exports = RAddRemove