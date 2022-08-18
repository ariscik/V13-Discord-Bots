const { ariscik, Users } = require('../../../../Helpers/Schemas')
class Name extends Command {
    constructor(client) {
        super(client, {
            name: "isim",
            aliases: ["i", "name", "isimdeğiştir"],
            cooldown: 30
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!aris.commandsChannel.some(kanal => message.channel.id.includes(kanal)) && message.channel.id !== aris.welcomeChannel) return message.reply(`**UYARI:** Bu komutu yalnızca <#${aris.welcomeChannel}> veya <#${aris.commandsChannel[0]}> kanalında kullanabilirsin!`).sil(10)
        if (!message.member.roles.cache.has(aris.registerHammer) && !config.Founders.includes(message.author.id) && !config.root.includes(message.author.id) && !aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)]}).sil(15)
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        args = args.filter(a => a !== "" && a !== " ").splice(1);
        let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase() + arg.slice(1)).join(" "); let yaş = args.filter(arg => !isNaN(arg))[0]
        if (!member) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir üye belirtmeyi unuttun!`)] }).sil(10)
        if (!member.manageable) return message.channel.send({ embeds: [embed.setDescription(`**UYARI : ** Bu üye üzerinde işlem yapacak yetkim yok!`)] }).sil(20)
        if (!isim) return message.channel.send({ embeds: [embed.setDescription(`**UYARI : **Kayıt edilecek kişi için bir isim belirtmelisin!`)]}).sil(10)
        if (!yaş) return message.channel.send({ embeds: [embed.setDescription(`**UYARI : **Kayıt edilecek kişi için bir yaş belirtmelisin!`)]}).sil(10)
        if (member === message.author.id) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Kendi üzerinizde işlem yapamazsınız!`)] }).sil(10)
        if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send({ embeds: [embed.setDescription(`**UYARI : **Bu üyenin yetkisi senden üst pozisyonda!`)] }).sil(20)
        let setName;
        setName = `${aris.tags.some(tag => member.user.username.includes(tag)) || member.user.discriminator == aris.tags.filter(t => t.startsWith("#")) ? aris.isimsembol : (aris.isimsemboliki ? aris.isimsemboliki : aris.isimsembol)} ${isim} | ${yaş}`
         if (member.manageable) member.setNickname(`${setName}`, `İsim değiştirme, Yetkili : ${message.author.id}`)
        message.channel.send({ embeds: [embed.setDescription(`${emojis.onay} **Tebrikler!** ${member} kişisinin ismi, ${message.author} tarafından başarıyla \`${setName}\` olarak değiştirildi!`)] }).sil(20)
        client.channels.cache.get(aris.denetimLog).send({ embeds: [embed.setDescription(`${member} \`(${member.id})\` adlı kullanıcının ismi ${message.author} \`(${message.author.id}\` tarafından ${new Date(message.createdAt).toTurkishFormatDate()} tarihinde \`${setName}\` olarak değiştirildi! ${emojis.onay}`)] })
        await Users.findOneAndUpdate({ userID: member.id }, { $push: { Names: { userID: message.author.id, Name: `${setName}`, islem: "İsim Değiştirme" } } }, { upsert: true });
  
    }
}

module.exports = Name