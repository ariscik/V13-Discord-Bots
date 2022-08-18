const { ariscik, Users } = require('../../../../Helpers/Schemas')
class Names extends Command {
    constructor(client) {
        super(client, {
            name: "isimler",
            aliases: ["names"],
            cooldown: 10
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!aris.commandsChannel.some(kanal => message.channel.id.includes(kanal)) && message.channel.id !== aris.welcomeChannel) return message.reply(`**UYARI:** Bu komutu yalnızca <#${aris.welcomeChannel}> kanalında kullanabilirsin!`).sil(10)
        if (!message.member.roles.cache.has(aris.registerHammer) && !config.Founders.includes(message.author.id) && !config.root.includes(message.author.id) && !aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)]}).sil(15)
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        var sayi = 1
        var currentPage = 1
        if (!member) return message.reply({ embeds: [embed.setDescription(`**UYARI : **Bir kullanıcı belirtmeyi unuttun!`)] }).sil(7)
        const data = await Users.findOne({ userID: member.id }) || []
        if (!data) return message.reply({ embeds: [embed.setDescription(`**UYARI : **Kullanıcıya ait herhangi bir isim verisi bulunamadı!`)] }).sil(7)
        if (!data.Names) return message.reply({ embeds: [embed.setDescription(`**UYARI : **Kullanıcıya ait herhangi bir isim verisi bulunamadı!`)] }).sil(7)
        let isimler = data.Names
        isimler.map(e => e ? `${sayi++}-` : "")
        let pages = isimler.chunk(15);
        if (!pages.length || !pages[currentPage - 1].length) return message.reply({ embeds: [embed.setDescription(`**UYARI : **Kullanıcıya ait herhangi bir isim verisi bulunamadı!`)] }).sil(7)
        if (pages.length === 1) {
            await message.channel.send({ embeds: [embed.setDescription(`${member} adlı üyenin toplam **${sayi - 1}** isim verisi bulundu!\n\n${pages[currentPage - 1].map(e => `\`${e.Name}\` ${e.rol ? `(<@&${e.rol}>)` : ""} (${e.islem}) (<@!${e.userID}>)`).join("\n")}`).setThumbnail(member.user.avatarURL({ dynamic: true })).setFooter(`Sayfa: ${currentPage}`).setAuthor(member.user.username, member.user.avatarURL({ dynamic: true }))] })
        } else {
            const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId('igeri').setLabel("◀").setStyle('PRIMARY'), new Discord.MessageButton().setCustomId('isimleriptal').setLabel("❌").setStyle('DANGER'), new Discord.MessageButton().setCustomId('iileri').setLabel("▶").setStyle('PRIMARY'),);
            let msg = await message.channel.send({ components: [row], embeds: [embed.setDescription(`${member} adlı üyenin toplam **${sayi - 1}** isim verisi bulundu!\n\n${pages[currentPage - 1].map(e => `\`${e.Name}\` ${e.rol ? `(<@&${e.rol}>)` : ""} (${e.islem}) (<@!${e.userID}>)`).join("\n")}`).setThumbnail(member.user.avatarURL({ dynamic: true })).setFooter(`Sayfa: ${currentPage}`).setAuthor(member.user.username, member.user.avatarURL({ dynamic: true }))] })
            var filter = (button) => button.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 30000 })
            collector.on('collect', async (button, user) => {
                if (button.customId === "iileri") {
                    await button.deferUpdate();
                    if (currentPage == pages.length) return;
                    currentPage++;
                    if (msg) msg.edit({ embeds: [embed.setDescription(`${pages[currentPage - 1].map(e => `\`${e.Name}\` ${e.rol ? `(<@&${e.rol}>)` : ""} (${e.islem}) (<@!${e.userID}>)`).join("\n")}`).setThumbnail(member.user.avatarURL({ dynamic: true })).setFooter(`Sayfa: ${currentPage}`).setAuthor(member.user.username, member.user.avatarURL({ dynamic: true }))] });

                } else if (button.customId === "isimleriptal") {
                    await button.deferUpdate();
                    if (msg) msg.delete().catch(err => { });
                    if (message) return message.delete().catch(err => { });

                } else if (button.customId === "igeri") {
                    await button.deferUpdate();
                    if (currentPage == 1) return;
                    currentPage--;
                    if (msg) msg.edit({ embeds: [embed.setDescription(`${pages[currentPage - 1].map(e => `\`${e.Name}\` ${e.rol ? `(<@&${e.rol}>)` : ""} (${e.islem}) (<@!${e.userID}>)`).join("\n")}`).setThumbnail(member.user.avatarURL({ dynamic: true })).setFooter(`Sayfa: ${currentPage}`).setAuthor(member.user.username, member.user.avatarURL({ dynamic: true }))] });
                }
            });
        }
    }
}

module.exports = Names