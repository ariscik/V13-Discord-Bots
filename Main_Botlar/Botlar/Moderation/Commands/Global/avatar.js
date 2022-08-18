const { ariscik } = require('../../../../Helpers/Schemas')
class Avatar extends Command {
    constructor(client) {
        super(client, {
            name: "avatar",
            aliases: ["av", "avt"],
            cooldown: 45
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!aris.commandsChannel.some(kanal => message.channel.id.includes(kanal))) return message.reply(`**UYARI:** Bu komutu yalnızca <#${aris.commandsChannel[0]}> kanalında kullanabilirsin!`).sil(10)
        const victim = message.mentions.users.first() || await client.fetchUser(args[0]) || message.author;
        const avatar = victim.avatarURL({ dynamic: true, size: 2048 })
        const KullaniciAvatar = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle("Kullanıcı Avatarı")
            .setDescription(`[Resim Adresi için TIKLA](${avatar})`)
            .setTimestamp()
            .setAuthor(victim.tag, avatar)
            .setFooter(`${message.member.displayName} tarafından istendi!`, message.author.avatarURL({ dynamic: true }))
            .setImage(avatar)
        await message.reply({ embeds: [KullaniciAvatar] });
   
    }
}

module.exports = Avatar