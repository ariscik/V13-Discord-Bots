const { ariscik } = require('../../../../Helpers/Schemas')
const moment = require("moment")
moment.locale("tr")
class Unregister extends Command {
    constructor(client) {
        super(client, {
            name: "kayıtsız",
            aliases: ["unregister", "ks", "kayitsiz"],
            Aris: true,
            Founder: true
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!aris.commandsChannel.some(kanal => message.channel.id.includes(kanal))) return message.reply(`**UYARI:** Bu komutu yalnızca <#${aris.commandsChannel[0]}> kanalında kullanabilirsin!`).sil(10)
        if (!message.member.roles.cache.has(aris.registerHammer) && !config.Founders.includes(message.author.id) && !config.root.includes(message.author.id) && !aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)]}).sil(15)
        if (!client.beklemeSure.has(module.exports.name)) { client.beklemeSure.set(module.exports.name, new Discord.Collection()); }
        const zamanDamga = client.beklemeSure.get(module.exports.name);
        const beklemeSuresi = 1000 * 60 * config.Sure;
        if (config.kayitsizLimit > 0 && client.kayitsizLimit.has(message.author.id) && client.kayitsizLimit.get(message.author.id) == ayarlar.kayitsizLimit && zamanDamga.has(message.author.id)) {
            const sonaErme = zamanDamga.get(message.author.id) + beklemeSuresi; if (Date.now() < sonaErme) { const timeLeft = (sonaErme - Date.now()) / 1000; return message.reply(`${emojis.hata} **UYARI:** \`${module.exports.name}\` komutunu tekrardan kullanabilmek için \`${timeLeft.toFixed(1)}\` saniye beklemelisin.`); }
        }
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir üye belirtmeyi unuttun!`)]}).sil(10)
        if (member.roles.cache.has(aris.unregisterRole)) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu kullanıcı zaten kayıtsız!`)]}).sil(10)
        if (member.id === message.guild.ownerId) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu kişi sunucu sahibi!`)]}).sil(10)
        if (member === message.member) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Kendini kayıtsıza atamazsın!`)]}).sil(10)
        if (member.user.bot) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir botu kayıtsıza atamazsın!`)]}).sil(10)
        if (!member.manageable) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu kullanıcı üzerinde işlem yapmak için yetkim yok!`)]}).sil(10)
        if (member.roles.highest.position >= message.member.roles.highest.position && !config.Founders.includes(message.author.id)) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu üye senden yüksek yetkide!`)]}).sil(10)
        member.setRoles(aris.unregisterRole)
        member.setNickname(`${aris.isimsembol} Kayıtsız`)
        message.channel.send({ embeds: [embed.setDescription(`${emojis.onay} ${member} (\`${member.user.tag} - ${member.id}\`) kişisi ${message.author} tarafından kayıtsıza atıldı!`)]}).sil(100)
        client.channels.cache.get(aris.denetimLog).send({ embeds: [embed.setDescription(`${member} (\`${member.user.tag} - ${member.id}\`) kişisi ${message.author} tarafından \`${moment(Date.now()).format("LLL")}\` tarihinde kayıtsıza atıldı! ${emojis.onay}`)]})
        zamanDamga.set(message.author.id, Date.now());
        if (config.kayitsizLimit > 0 && !config.Founders.includes(message.author.id) && !config.root.includes(message.author.id)) { if (!client.kayitsizLimit.has(message.author.id)) client.kayitsizLimit.set(message.author.id, 1); else { client.kayitsizLimit.set(message.author.id, client.kayitsizLimit.get(message.author.id) + 1); }; setTimeout(() => { if (client.kayitsizLimit.has(message.author.id)) client.kayitsizLimit.delete(message.author.id); zamanDamga.delete(message.author.id); }, beklemeSuresi); }

    }
}

module.exports = Unregister