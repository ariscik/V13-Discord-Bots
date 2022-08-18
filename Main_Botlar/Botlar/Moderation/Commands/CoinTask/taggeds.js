const { ariscik, Users } = require('../../../../Helpers/Schemas')
class Taggeds extends Command {
    constructor(client) {
        super(client, {
            name: "taggeds",
            aliases: ["taglılar", "taglılarım", "taglısay"],
            cooldown: 10
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: config.guildID })
        if (!message.member.roles.cache.has(aris.registerHammer)) return message.reply(`Bu komutu kullanmak için yeterli yetkiniz yok!`).sil(20)
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        var sayi = 1
        var currentPage = 1
        let data = await Users.findOne({ userID: member.id })
        if (!data || data && !data.Taggeds.length) return message.reply({ embeds: [embed.setDescription(`Kullanıcıya ait herhangi bir taglı verisi bulunamadı!`)] }).sil(10)
        let taggeds = data.Taggeds
        taggeds.map(e => e ? `${sayi++}-` : "")
        let pages = taggeds.chunk(15);
        if (!pages.length || !pages[currentPage - 1].length) return message.reply({ embeds: [embed.setDescription(`Kullanıcıya ait herhangi bir taglı verisi bulunamadı!`)] })
        if (pages.length === 1) {
            await message.reply({ embeds: [embed.setDescription(`${member} adlı kullanıcının toplam **${sayi - 1}** taglısı bulundu!\n\n${pages[currentPage - 1].map(e => e ? ` <@!${e.userID}> - ${new Date(e.date).toTurkishFormatDate()}` : "").join("\n")}`).setFooter(`Developed By Aris.`)] })
        } else {
            const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId('geri').setLabel("◀").setStyle('PRIMARY'), new Discord.MessageButton().setCustomId('iptal').setLabel("❌").setStyle('DANGER'), new Discord.MessageButton().setCustomId('ileri').setLabel("▶").setStyle('PRIMARY'),);
            let msg = await message.reply({ components: [row], embeds: [embed.setDescription(`${member} adlı kullanıcının toplam **${sayi - 1}** taglısı bulundu!\n\n${pages[currentPage - 1].map(e => e ? ` <@!${e.userID}> - ${new Date(e.date).toTurkishFormatDate()}` : "").join("\n")}`).setFooter(`Sayfa: ${currentPage}`)] })
            var filter = (button) => button.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({ filter })
            collector.on('collect', async (button, user) => {
                if (button.customId === "ileri") {
                    await button.deferUpdate();
                    if (currentPage == pages.length) return;
                    currentPage++;
                    if (msg) msg.edit({ embeds: [embed.setDescription(`${pages[currentPage - 1].map(e => e ? `<@!${e.userID}> - ${new Date(e.date).toTurkishFormatDate()}` : "").join("\n")}`).setFooter(`Sayfa: ${currentPage}`)] });
                }
                if (button.customId === "geri") {
                    await button.deferUpdate();
                    if (currentPage == 1) return;
                    currentPage--;
                    if (msg) msg.edit({ embeds: [embed.setDescription(`${pages[currentPage - 1].map(e => e ? `<@!${e.userID}> - ${new Date(e.date).toTurkishFormatDate()}` : "").join("\n")}`).setFooter(`Sayfa: ${currentPage}`)] });
                }
                if (button.customId === "iptal") {
                    if (msg) msg.delete().catch(err => { });
                    if (message) return message.delete().catch(err => { });
                }
            })
        }
    }
}

module.exports = Taggeds