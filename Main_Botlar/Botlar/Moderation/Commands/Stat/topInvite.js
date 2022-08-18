const { ariscik, Inviter } = require('../../../../Helpers/Schemas')
class TopInvıte extends Command {
    constructor(client) {
        super(client, {
            name: "topinvite",
            aliases: ["topinvites", "ti"],
            cooldown: 10
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!aris.commandsChannel.some(kanal => message.channel.id.includes(kanal))) return message.reply(`**UYARI:** Bu komutu yalnızca <#${aris.commandsChannel[0]}> kanalında kullanabilirsin!`).sil(10)
        let data = await Inviter.find({ guildID: message.guild.id }).sort({ total: -1 }); if (!data.length) return message.reply({ embeds: [embed.setDescription(`Herhangi bir davet verisi bulunamadı!`)] }).sil(10); let list = data.filter((x) => message.guild.members.cache.has(x.userID)).splice(0, 15).map((x, index) => `\`${index == 0 ? `👑` : `${index+1}.`}\` <@${x.userID}>: \`${x.total + x.bonus} Davet\``).join("\n"); await message.reply({ embeds: [embed.addField("Davetler", `${list}`, true).setAuthor(message.guild.name + " Davet Sıralaması", message.guild.iconURL({ dynamic: true })).setThumbnail(message.guild.iconURL({ dynamic: true })).setColor("RANDOM").setTimestamp().setFooter(message.member.displayName + " tarafından istendi!", message.author.avatarURL({ dynamic: true }))] })
    }
}

module.exports = TopInvıte