const { ariscik, Penalties } = require('../../../../Helpers/Schemas')
const moment = require("moment"); moment.locale("tr"); const ms = require("ms")
class Vmute extends Command {
    constructor(client) {
        super(client, {
            name: "vmute",
            aliases: ["voicemute", "sesmute", "sessustur"],
            cooldown: 60
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!message.member.roles.cache.has(aris.muteHammer) && !config.Founders.includes(message.author.id) && !config.root.includes(message.author.id) && !aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)] }).sil(15)
        if (!client.beklemeSure.has(module.exports.name)) { client.beklemeSure.set(module.exports.name, new Discord.Collection()); }
        const zamanDamga = client.beklemeSure.get(module.exports.name);
        const beklemeSuresi = 1000 * 60 * config.Sure;
        if (config.muteLimit > 0 && client.muteLimit.has(message.author.id) && client.muteLimit.get(message.author.id) == config.muteLimit && zamanDamga.has(message.author.id)) { const sonaErme = zamanDamga.get(message.author.id) + beklemeSuresi; if (Date.now() < sonaErme) { const timeLeft = (sonaErme - Date.now()) / 1000; return message.reply({ embeds: [embed.setDescription(`**UYARI:** \`${module.exports.name}\` komutunu tekrardan kullanabilmek için \`${timeLeft.toFixed(1)}\` saniye beklemelisin.`)] }).sil(10) } }
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]); if (!member) return message.reply({ embeds: [embed.setDescription(`**UYARI : **Bir üye belirtmeyi unuttun!`)] }).sil(10)
        if (member.roles.cache.has(aris.vmutedRole)) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** BU kullanıcı zaten seste susturulmuş!`)]}).sil(10)
        const sure = args[1] ? ms(args[1]) : undefined;
        const reason = args.splice(2).join(" ");
        if (!sure) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Kullanıcıyı susturmak için bir süre belirt!`)]}).sil(10)
        if (!reason) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Bir sebep belirtmelisin!`)] }).sil(10)
        if (config.Founders.includes(member.id) && config.root.includes(message.author.id)) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Mutelemeye çalıştığın kişi bot sahibi!`)] }).sil(10)
        const uye = message.guild.members.cache.get(member.id)
        if (uye.id === message.author.id) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Kendini susturamazsın!`)] }).sil(10)
        if (uye && uye.user.bot) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Bir botu susturamazsın!`)] }).sil(10)
        if (uye && !uye.manageable) return message.reply({ embeds: [embed.setDescription(`**UYARI : ** Bu kullanıcıyı susturamıyorum!`)] }).sil(10)
        if (!member.voice.channel) return message.reply(`Kullanıcı bir ses kanalında değil!`)
        if (uye && uye.roles.highest.position >= message.member.roles.highest.position && !config.Founders.includes(message.author.id)) return message.reply({ embeds: [embed.setDescription(`**UYARI :** Bu kullanıcı senden üst yetkide ya da aynı yetkidesiniz!`)] }).sil(10)
        member.voice.setMute(true);
        await member.roles.add(aris.vmutedRole, `Ses Susturma, Yetkili: ${message.author.id}`)
        const muteSure = ms(sure).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
        if (uye) { uye.send({ embeds: [embed.setDescription(`**${message.guild.name}** sunucusundan **${reason}** sebebiyle **${muteSure}** boyunca **${message.author}** tarafından seste susturuldun! Bir hata olduğunu düşünüyorsan üst yönetim ile iletişime geçebilirsin!`)] }).catch(err => message.channel.send({ embeds: [embed.setDescription(`${uye} kişisinin özel mesajı kapalı olduğu için dm gönderemedim!`)] }).sil(10)) }
        const cezaVeri = await Penalties.findOne({ guildID: message.guild.id, userID: member.id, Ceza: "VOICEMUTE", Aktif: true });
        if (cezaVeri) { cezaVeri.Aktif = false; await cezaVeri.save(); }
        const ceza = await client.Penalties(message.guild.id, member.id, "VOICEMUTE", true, message.author.id, reason, Date.now(), muteSure, Date.now() + sure);
        message.reply({ embeds: [embed.setDescription(`${emojis.vmute} ${uye} - ${member.user.username.replace(/\`/g, "")} \`(${member.id})\` kişisi ${message.author} tarafından ${reason} sebebi ile ${muteSure} boyunca seste susturuldu! \`(#${ceza.id})\``)] }).sil(50)
        if (aris.muteLog) client.channels.cache.get(aris.muteLog).send({ embeds: [embed.setThumbnail(member.avatarURL({ dynamic: true })).setAuthor({ name : message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) }).setDescription(`${emojis.nokta} **Susturulan Kullanıcı :** ${member} (\`${member.user.username.replace(/\`/g, "")} - ${member.id}\`)\n${emojis.nokta} **Susturan Yetkili :** ${message.author} (\`${message.author.tag} - ${message.author.id}\`)\n${emojis.nokta} **Susturulma Zamanı :** \`${moment(Date.now()).format("LLL")}\`\n${emojis.nokta} **Susturulma Sebebi :** \`${reason}\`\n${emojis.nokta} **Susturulma Süresi :** \`${muteSure}\``).setTitle(`Ses Susturma İşlemi!`).setFooter(`Ceza ID : #${ceza.id}`)] })
        zamanDamga.set(message.author.id, Date.now());
        if (config.muteLimit > 0 && !config.Founders.includes(message.author.id)) { if (!client.muteLimit.has(message.author.id)) client.muteLimit.set(message.author.id, 1); else { client.muteLimit.set(message.author.id, client.muteLimit.get(message.author.id) + 1); }; setTimeout(() => { if (client.muteLimit.has(message.author.id)) client.muteLimit.delete(message.author.id); zamanDamga.delete(message.author.id); }, beklemeSuresi); }
    }
}

module.exports = Vmute