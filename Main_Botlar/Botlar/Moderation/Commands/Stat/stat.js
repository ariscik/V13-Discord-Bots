const { ariscik, messageUserChannel, voiceUserChannel, messageUser, voiceUser } = require('../../../../Helpers/Schemas')
const moment = require("moment"); require("moment-duration-format");
class Stat extends Command {
    constructor(client) {
        super(client, {
            name: "stat",
            aliases: ["me", "user"],
            cooldown: 10
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!aris.commandsChannel.some(kanal => message.channel.id.includes(kanal))) return message.reply(`**UYARI:** Bu komutu yalnızca <#${aris.commandsChannel[0]}> kanalında kullanabilirsin!`).sil(10)
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const Active1 = await messageUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 }); const Active2 = await voiceUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 }); let mesajVeri = Active1.length > 0 ? Active1.splice(0, 5).filter(x => message.guild.channels.cache.has(x.channelID)).map(x => `• <#${x.channelID}>: \`${Number(x.channelData).toLocaleString()} mesaj\``).join("\n") : "Veri bulunmuyor."; let sesVeri = Active2.length > 0 ? Active2.splice(0, 5).filter(x => message.guild.channels.cache.has(x.channelID)).map(x => `• <#${x.channelID}>: \`${moment.duration(x.channelData).format("H [saat], m [dakika]")}\``).join("\n") : "Veri bulunmuyor."; const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: member.id }); const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: member.id });
        message.channel.send({ embeds: [embed.setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 })).setDescription(`${member} adlı üyenin sunucu içerisi detaylı istatistikleri; \n\n**Genel Toplam Chat :** \`${Number(messageData ? messageData.topStat : 0).toLocaleString()} mesaj\`\n**Genel Toplam Ses : **\`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\`\n\n**Haftalık Chat İstatistiği :** \`${Number(messageData ? messageData.weeklyStat : 0).toLocaleString()} mesaj\`\n**Haftalık Ses İstatistiği :** \`${moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika]")}\``).addField(`Genel Sohbet Bilgisi : `, `${mesajVeri}`).addField(`Genel Ses Bilgisi : `, `${sesVeri}`)] })
    }
}

module.exports = Stat