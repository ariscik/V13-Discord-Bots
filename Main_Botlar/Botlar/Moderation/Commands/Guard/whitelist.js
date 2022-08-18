const { ariscik } = require('../../../../Helpers/Schemas')
class Whitelist extends Command {
    constructor(client) {
        super(client, {
            name: "whitelist",
            aliases: ["güvenli", "piç"],
            Founder: true
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        const member = message.mentions.users.first() || await client.fetchUser(args[1]);
        if (!args[0] || args[0].toLowerCase() !== "ekle" && args[0].toLowerCase() !== "çıkar") { message.reply({ embeds: [embed.setDescription(`**${message.guild.name}** Sunucusu güvenli sistemine hoşgeldin!\n\nGüvenli listeye eklemek/çıkarmak için \`.güvenli ekle/çıkar @üye/üyeid\`\n\n${aris.WhiteListMembers ? aris.WhiteListMembers.map(id => `<@${id}>`).join('\n') : 'Güvenlide hiç üye yok.'}`)] }) }
        else if (args[0].toLowerCase() === "ekle") {
            if (!args[1]) return message.reply(`**UYARI :** Bir üye belirtmeyi unuttun!`).sil(5)
            if (!member) return message.reply(`**UYARI :** Bir üye belirtmeyi unuttun!`).sil(5)
            else if (aris.WhiteListMembers.includes(member.id)) return message.reply({ embeds: [embed.setDescription(`Bu üye zaten güvenli listede ${emojis.iptal}`)] }).sil(5)
            else {
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $push: { WhiteListMembers: member.id } }, { upsert: true })
                message.reply({ embeds: [embed.setDescription(`${member} adlı kullanıcı başarı ile güvenli listeye eklendi ${emojis.onay}`)] })
            }
        } else if (args[0].toLowerCase() === "çıkar") {
            if (!args[1]) return message.reply(`**UYARI :** Bir üye belirtmeyi unuttun!`).sil(5)
            if (!member) return message.reply(`**UYARI :** Bir üye belirtmeyi unuttun!`).sil(5)
            else if (!aris.WhiteListMembers.includes(member.id)) return message.reply({ embeds: [embed.setDescription(`Bu üye zaten güvenli listede değil ${emojis.iptal}`)] }).sil(5)
            else {
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $pull: { WhiteListMembers: member.id } }, { upsert: true })
                message.reply({ embeds: [embed.setDescription(`${member} adlı kullanıcı başarı ile güvenli listeden çıkarıldı ${emojis.onay}`)] })
            }
        }
    }
}

module.exports = Whitelist