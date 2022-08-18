const { ariscik } = require('../../../../Helpers/Schemas')
const { Permissions } = require('discord.js');
class GuildS extends Command {
    constructor(client) {
        super(client, {
            name: "guild",
            aliases: ["guild"],
            Founder: true
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!args[0]) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir argüman belirtmelisin! \`isim - resim - banner - kanaloluştur\``)] }).sil(30)
        if (args[0] == 'kanaloluştur') {
            if (!args[1]) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Doğru kullanım : .kanaloluştur <ses-metin-kategori> <İsim> <Kategori>`)] }).sil(50)
            if (!args[2]) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Doğru kullanım : .kanaloluştur <ses-metin-kategori> <İsim> <Kategori>`)] }).sil(50)
            await message.guild.channels.create(args[2], { 
                type: args[1].replace("ses", "GUILD_VOICE").replace("metin", "GUILD_TEXT").replace("kategori", "GUILD_CATEGORY"),
            }).then(async channel => {
                await message.react(emojis.onay)
                await message.channel.send({ content: `${message.member} Merhaba! Başarılı bir şekilde \`${args[2]}\` isimli kanalı kurdum! ${emojis.onay}`}).sil(10)
                if (args[3]) channel.setParent(args[3], { lockPermissions: true }).then(x => {
                    message.channel.send(` Merhaba ${message.member}! Başarılı bir şekilde \`${args[2]}\` isimli kanalı \`${message.guild.channels.cache.get(args[3]).name}\` adlı kategoriye taşıdım! ${emojis.onay}`).sil(30)
                })
            });
            if (aris.denetimLog) client.channels.cache.get(aris.denetimLog).send({ embeds: [embed.setDescription(`${message.member} [${message.member.id}] tarafından \`${args[1]}\` isminde kanal oluşturuldu! ${emojis.onay}`)] })
        }
        if (args[0] == 'isim') {
            if (!args[1]) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir isim belirtmeyi unuttun!`)]}).sil(20)
            message.react(emojis.onay)
            await message.guild.setName(args[1]).catch(err => { })
            message.channel.send({ content: `${emojis.onay} Merhaba ${message.member}! Başarılı bir şekilde sunucu ismini \`${args[1]}\` olarak değiştirdim!`}).sil(20)
            if (aris.denetimLog) client.channels.cache.get(aris.denetimLog).send({ embeds: [embed.setDescription(`${message.member} [${message.member.id}] tarafından sunucu ismi \`${args[1]}\` olarak değiştirildi! ${emojis.onay}`)] })
        }
        if (args[0] == 'resim') {
            if (!args[1]) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir resim belirtmeyi unuttun!`)]}).sil(20)
            let resim = args.slice(1).join(" ") || message.attachments.first().url
            await message.guild.setBanner(resim).catch(e => { })
            await message.react(emojis.onay)
            await message.channel.send({ content: `${emojis.onay} Merhaba ${message.member}! Başarılı bir şekilde sunucu ismi değiştirildi!`}).sil(20)
            if (aris.denetimLog) client.channels.cache.get(aris.denetimLog).send({ embeds: [embed.setDescription(`${message.member} [${message.member.id}] tarafından sunucu resmi değiştirildi! ${emojis.onay}`)] })

        }
        if (args[0] == 'rololuştur') {
            if (!args[1]) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Doğru kullanım : .rololuştur <İsim> <Sıra> <Renk>`)] }).sil(50)
            if (!args[2]) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Doğru kullanım : .rololuştur <İsim> <Sıra> <Renk>`)] }).sil(50)
            if (!args[3]) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Doğru kullanım : .rololuştur <İsim> <Sıra> <Renk>`)] }).sil(50)
            await message.guild.roles.create({ name: args[1], reason: "Komut İle Kuruldu", position: args[2], color: args[3], permissions: Permissions.FLAGS.READ_MESSAGE_HISTORY, })
            await message.react(emojis.onay)
            message.channel.send({ content: `Merhaba ${message.member}! Başarılı bir şekilde \`${args[1]}\` isminde \`${args[2]}\` pozisyonunda \`${args[3]}\` renginder perm oluşturuldu!`})
        }
    }
}

module.exports = GuildS