const { ariscik, Snipes } = require('../../../../Helpers/Schemas');
const moment = require("moment")
class Snipe extends Command {
    constructor(client) {
        super(client, {
            name: "snipe",
            aliases: ["snipe"],
            cooldown: 15
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!config.Founders.includes(message.author.id) && !config.root.includes(message.author.id) && !aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)] }).sil(15)
        const data = await Snipes.findOne({ guildID: message.guild.id, channelID: message.channel.id });
        if (!data) return message.reply(`**UYARI:** Bu kanalda silinmiş bir mesaj bulunmuyor!`).sil(5)
        const author = await client.fetchUser(data.userID);
        embed.setColor("RANDOM").setTimestamp().setFooter(`Developed By Aris Lesnar.`, client.user.avatarURL({ dynamic: true }))
        embed.setDescription(`${data.messageContent ? `\n\`Mesaj içeriği:\` ${data.messageContent}` : ""}
\`Mesajın yazılma tarihi:\` ${moment.duration(Date.now() - data.createdDate).format("D [gün], H [saat], m [dakika], s [saniye]")} önce
\`Mesajın silinme tarihi:\` ${moment.duration(Date.now() - data.deletedDate).format("D [gün], H [saat], m [dakika], s [saniye]")} önce
\`Mesajı Atan Kişi:\` <@${data.userID}>   `);
        if (author) embed.setAuthor(author.tag, author.avatarURL({ dynamic: true, size: 2048 }));
        if (data.image) embed.setImage(data.image);
        message.reply({ embeds: [embed] }).sil(10)
    }
}

module.exports = Snipe