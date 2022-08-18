const { ariscik, voiceJoinedAt } = require('../../../../Helpers/Schemas')
class vControl extends Command {
    constructor(client) {
        super(client, {
            name: "nerede",
            aliases: ["n", "seskontrol", "sk"],
            cooldown: 10
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!config.Founders.includes(message.author.id) && !aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)] }).sil(15)
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if (!member.voice.channel) return message.reply({ embeds: [embed.setDescription(`${member} adlı kullanıcı herhangi bir ses kanalında değil.`)] }).sil(20)
        else { let joinedAtData = await voiceJoinedAt.findOne({ userID: member.id }); let limit = member.voice.channel.userLimit || "Limit Yok"; let mic = member.voice.selfMute ? `${emojis.iptal}` : `${emojis.onay}`; let kulak = member.voice.selfDeaf ? `${emojis.iptal}` : `${emojis.onay}`; let video = member.voice.selfVideo ? `${emojiler.onay}` : `${emojiler.iptal}`; let stream = member.voice.streaming ? `${emojiler.onay}` : `${emojiler.iptal}`
            message.reply({ embeds: [embed.setDescription(`${member}, adlı kullanıcı <#${member.voice.channel.id}> adlı ses kanalında bulunuyor.\nMikrafonu; ${mic}\nKulaklığı; ${kulak}\nKamerası; ${video}\nYayın; ${stream}\nKanaldaki kişi sayısı; \`${member.voice.channel.members.size}/${limit}\`\nKanalda Bulunma Süresi: <t:${Math.floor(joinedAtData / 1000)}:R> `)] }).sil(50)
        }
    }
}

module.exports = vControl