const { ariscik, Penalties } = require('../../../../Helpers/Schemas')
const moment = require("moment"); moment.locale("tr"); const ms = require("ms")
class Jail extends Command {
    constructor(client) {
        super(client, {
            name: "jail",
            aliases: ["karantina", "şüpheli", "reklam", "cezalı"],
            cooldown: 60
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!message.member.roles.cache.has(aris.jailHammer) && !config.Founders.includes(message.author.id) && !config.root.includes(message.author.id) &&!aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)] }).sil(15)
        if (!client.beklemeSure.has(module.exports.name)) { client.beklemeSure.set(module.exports.name, new Discord.Collection()); }
        const zamanDamga = client.beklemeSure.get(module.exports.name);
        const beklemeSuresi = 1000 * 60 * config.Sure;
        if (config.jailLimit > 0 && client.jailLimit.has(message.author.id) && client.jailLimit.get(message.author.id) == config.jailLimit && zamanDamga.has(message.author.id)) { const sonaErme = zamanDamga.get(message.author.id) + beklemeSuresi; if (Date.now() < sonaErme) { const timeLeft = (sonaErme - Date.now()) / 1000; return message.reply({ embeds: [embed.setDescription(`**UYARI:** \`${module.exports.name}\` komutunu tekrardan kullanabilmek için \`${timeLeft.toFixed(1)}\` saniye beklemelisin.`)] }).sil(10) } }
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]); if (!member) return message.reply({ embeds: [embed.setDescription(`**UYARI : **Bir üye belirtmeyi unuttun!`)] }).sil(10)
        if (member.roles.cache.has(aris.jailedRole)) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** BU kullanıcı zaten cezalıya atılmış!`)]}).sil(10)
        const reason = args.splice(1).join(" ");
        if (!reason) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Bir sebep belirtmelisin!`)] }).sil(10)
        if (config.Founders.includes(member.id) && config.root.includes(message.author.id)) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Mutelemeye çalıştığın kişi bot sahibi!`)] }).sil(10)
        const uye = message.guild.members.cache.get(member.id)
        if (uye.id === message.author.id) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Kendini jaile atamazsın!`)] }).sil(10)
        if (uye && uye.user.bot) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Bir botu jaile atamazsın!`)] }).sil(10)
        if (uye && !uye.manageable) return message.reply({ embeds: [embed.setDescription(`**UYARI : ** Bu kullanıcıyı jaile atamıyorum!`)] }).sil(10)
        if (uye && uye.roles.highest.position >= message.member.roles.highest.position && !config.Founders.includes(message.author.id)) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Bu kullanıcı senden üst yetkide ya da aynı yetkidesiniz!`)] }).sil(10)
        await member.setRoles(aris.jailedRole, `Cezalı, Yetkili: ${message.author.id}`)
        if (uye) { uye.send({ embeds: [embed.setDescription(`**${message.guild.name}** sunucusundan **${reason}** sebebiyle **${message.author}** tarafından cezalıya gönderildin! Bir hata olduğunu düşünüyorsan üst yönetim ile iletişime geçebilirsin!`)] }).catch(err => message.channel.send({ embeds: [embed.setDescription(`${uye} kişisinin özel mesajı kapalı olduğu için dm gönderemedim!`)] }).sil(10)) }
        const cezaVeri = await Penalties.findOne({ guildID: message.guild.id, userID: member.id, Ceza: "JAIL", Aktif: true });
        if (cezaVeri) { cezaVeri.Aktif = false; await cezaVeri.save(); }
        const ceza = await client.Penalties(message.guild.id, member.id, "JAIL", true, message.author.id, reason, Date.now());
        message.reply({ embeds: [embed.setDescription(`${emojis.jail} ${uye} - ${member.user.username.replace(/\`/g, "")} \`(${uye.id})\` kişisi ${message.author} tarafından ${reason} sebebi ile cezalıya gönderildi! \`(#${ceza.id})\``)] }).sil(50)
        if (aris.jailLog) client.channels.cache.get(aris.jailLog).send({ embeds: [embed.setThumbnail(member.avatarURL({ dynamic: true })).setAuthor({ name : message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) }).setDescription(`${emojis.nokta} **Cezalıya Atılan Kullanıcı :** ${member} (\`${member.user.username.replace(/\`/g, "")} - ${member.id}\`)\n${emojis.nokta} **Cezalıya Atan Yetkili :** ${message.author} (\`${message.author.tag} - ${message.author.id}\`)\n${emojis.nokta} **Cezalıya Atılma Zamanı :** \`${moment(Date.now()).format("LLL")}\`\n${emojis.nokta} **Cezalıya Atılma Sebebi :** \`${reason}\``).setTitle(`Cezalandırma İşlemi!`).setFooter(`Ceza ID : #${ceza.id}`)] })
        zamanDamga.set(message.author.id, Date.now());
        if (config.jailLimit > 0 && !config.Founders.includes(message.author.id)) { if (!client.jailLimit.has(message.author.id)) client.jailLimit.set(message.author.id, 1); else { client.jailLimit.set(message.author.id, client.jailLimit.get(message.author.id) + 1); }; setTimeout(() => { if (client.jailLimit.has(message.author.id)) client.jailLimit.delete(message.author.id); zamanDamga.delete(message.author.id); }, beklemeSuresi); }
    
    }
}

module.exports = Jail