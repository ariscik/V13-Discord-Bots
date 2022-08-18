const { ariscik } = require('../../../../Helpers/Schemas')
class Say extends Command {
    constructor(client) {
        super(client, {
            name: "say",
            aliases: ["say"],
            cooldown: 30
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        var takviye = message.guild.premiumSubscriptionCount
        var üyesayısı = message.guild.members.cache.size
        var sesdekiler = message.guild.members.cache.filter((x) => x.voice.channel).size
        var aktif = message.guild.members.cache.filter(m => m.presence && m.presence.status !== "offline").size
        let etiket = aris.tags.filter(discrim => !isNaN(discrim))[0]
        var Taglı = `${message.guild.members.cache.filter(x => aris.tags.some(tag => x.user.tag.includes(tag)) || x.user.discriminator == etiket).size}`
        message.channel.send({ embeds: [embed.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 })).setDescription(`${emojis.star} Toplam üye sayısı : \`${üyesayısı}\`\n${emojis.star} Çevrimiçi üye sayısı : \`${aktif}\`\n${emojis.star} Sesteki toplam üye sayısı : \`${sesdekiler}\`\n${emojis.star} Toplam taglı üye sayısı : \`${Taglı}\`\n${emojis.star} Toplam takviye sayısı : \`${takviye}\``)]}).sil(70)
   
    }
}

module.exports = Say