const { ariscik, Users } = require('../../../../Helpers/Schemas')
class TopTaggeds extends Command {
    constructor(client) {
        super(client, {
            name: "toptaggeds",
            aliases: ["toptaglılar", "toptaglı", "toptaglısay"],
            cooldown: 10
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: config.guildID })
        if (!message.member.roles.cache.has(aris.tagRol)) return message.reply("Yetkin yok!")
        await Users.find().exec((err, data) => {
            data = data.filter(m => message.guild.members.cache.has(m.userID));
            let topTagli = data.filter(x => x.Taggeds).sort((uye1, uye2) => {
              let uye2Toplam2 = 0;
              uye2Toplam2 = uye2.Taggeds.length
              let uye1Toplam2 = 0;
              uye1Toplam2 = uye1.Taggeds.length
              return uye2Toplam2-uye1Toplam2;
          }).slice(0, 20).map((m, index) => {
              let uyeToplam2 = 0;
              uyeToplam2 = m.Taggeds.length
              return `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(m.userID)} toplam taglıları \`${uyeToplam2} üye\` ${m.id == message.member.id ? `**(Siz)**` : ``}`;
          }).join('\n');

          message.channel.send({embeds: [embed.setDescription(`${topTagli ? `${topTagli}` : `\`${message.guild.name}\` sunucusun da taglı bilgileri bulunamadı.`}`)] })
          })
    }
}

module.exports = TopTaggeds