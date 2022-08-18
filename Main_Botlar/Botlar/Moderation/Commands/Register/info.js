const { ariscik, Users } = require('../../../../Helpers/Schemas')
class KInfo extends Command {
    constructor(client) {
        super(client, {
            name: "kayıtbilgi",
            aliases: ["kayıtbilgi", "kb", "teyitler", "teyitlerim"],
            cooldown: 10
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!aris.commandsChannel.some(kanal => message.channel.id.includes(kanal))) return message.reply(`**UYARI:** Bu komutu yalnızca <#${aris.commandsChannel[0]}> kanalında kullanabilirsin!`).sil(10)
        if (!message.member.roles.cache.has(aris.registerHammer) && !config.Founders.includes(message.author.id) && !config.root.includes(message.author.id) && !aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)]}).sil(15)
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        const data = await Users.findOne({ userID: member.id }) || [];
        const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId('teyitler').setLabel(`Teyitleri Gör!`).setStyle('PRIMARY'))
        let teyitler = await message.channel.send({ embeds: [embed.setAuthor(member.user.tag, member.user.avatarURL()).setDescription(`${member} toplam **${data.TeyitNo ? data.TeyitNo : 0}** kayıt yapmış! (**${data.Teyitler ? data.Teyitler.filter(v => v.Gender === "Erkek").length : 0}** erkek, **${data.Teyitler ? data.Teyitler.filter(v => v.Gender === "Kadın").length : 0}** kadın)`).setColor('RANDOM').setTimestamp()], components: [row] })
        var filter = (button) => button.user.id === message.author.id;
        const collector = teyitler.createMessageComponentCollector({ filter })
        collector.on('collect', async (button, user) => {
            if (button.customId === "teyitler") {
                if (teyitler) teyitler.delete();
                var sayi = 1
                var currentPage = 1
                const data = await Users.findOne({ userID: member.id }) || []
                if (!data) return button.channel.send({ embeds: [embed.setDescription(`**UYARI :** ${member} Adlı kullanıcıya ait herhangi bir teyit verisi bulunamadı!`)] }).sil(10)
                if (!data.Teyitler) return button.channel.send({ embeds: [embed.setDescription(`**UYARI :** ${member} Adlı kullanıcıya ait herhangi bir teyit verisi bulunamadı!`)] }).sil(10)
                let teyits = data.Teyitler.filter(e => message.guild.members.cache.get(e.userID))
                teyits.map(e => e ? `${sayi++}-` : "")
                let pages = teyits.chunk(15);
                if (!pages.length || !pages[currentPage - 1].length) return button.channel.send({ embeds: [embed.setDescription(`**UYARI :** ${member} Adlı kullanıcıya ait herhangi bir teyit verisi bulunamadı!`)] }).sil(20)
                if (pages.length === 1) {
                    await button.channel.send({ embeds: [embed.setDescription(`${member} adlı kullanıcının toplam **${sayi - 1}** teyidi bulundu! \n\n${pages[currentPage - 1].map(e => e ? ` <@!${e.userID}> (<@&${e.rol}>) ${new Date(e.date).toTurkishFormatDate()}` : "").join("\n")}`).setFooter(`Sayfa: ${currentPage}`)] })
                } else {
                    const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId('tgeri').setLabel("◀").setStyle('PRIMARY'), new Discord.MessageButton().setCustomId('teyitiptal').setLabel("❌").setStyle('DANGER'), new Discord.MessageButton().setCustomId('tileri').setLabel("▶").setStyle('PRIMARY'),);
                    let msg = await message.channel.send({ components: [row], embeds: [embed.setDescription(`${member} adlı kullanıcının toplam **${sayi - 1}** teyidi bulundu! \n\n${pages[currentPage - 1].map(e => e ? ` <@!${e.userID}> (<@&${e.rol}>) ${new Date(e.date).toTurkishFormatDate()}` : "").join("\n")}`).setFooter(`Sayfa: ${currentPage}`)] })
                    var filter = (button) => button.user.id === message.author.id;
                    const collector = msg.createMessageComponentCollector({ filter, time: 30000 })
                    collector.on('collect', async (button, user) => {
                        if (button.customId === "tileri") {
                            await button.deferUpdate();
                            if (currentPage == pages.length) return;
                            currentPage++;
                            if (msg) msg.edit({ embeds: [embed.setDescription(`${pages[currentPage - 1].map(e => e ? `<@!${e.userID}> (<@&${e.rol}>) ${new Date(e.date).toTurkishFormatDate()}` : "").join("\n")}`).setFooter(`Sayfa: ${currentPage}`)] });

                        } else if (button.customId === "teyitiptal") {
                            await button.deferUpdate();
                            if (msg) msg.delete().catch(err => { });
                            if (message) return message.delete().catch(err => { });

                        } else if (button.customId === "tgeri") {
                            await button.deferUpdate();
                            if (currentPage == 1) return;
                            currentPage--;
                            if (msg) msg.edit({ embeds: [embed.setDescription(`${pages[currentPage - 1].map(e => e ? `<@!${e.userID}> (<@&${e.rol}>) ${new Date(e.date).toTurkishFormatDate()}` : "").join("\n")}`).setFooter(`Sayfa: ${currentPage}`)] });
                        }
                    });
                    collector.on("end", async (button) => { if (msg) msg.delete(); })
                }
            }
        })
    }
}

module.exports = KInfo