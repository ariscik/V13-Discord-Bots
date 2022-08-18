const { ariscik, Penalties, Users } = require('../../../../Helpers/Schemas')
class Bilgi extends Command {
    constructor(client) {
        super(client, {
            name: "bilgi",
            aliases: ["info"],
            cooldown: 60
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!aris.commandsChannel.some(kanal => message.channel.id.includes(kanal))) return message.reply(`**UYARI:** Bu komutu yalnızca <#${aris.commandsChannel[0]}> kanalında kullanabilirsin!`).sil(10)
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        const data = await Users.findOne({ userID: member.id }) || [];
        const cezapuanData = await Penalties.findOne({ guildID: message.guild.id, userID: member.user.id });
        let teyit = data.Teyitci
        let status = member?.presence?.status ? member?.presence?.status?.toString().replace("dnd", `Rahatsız Etmeyin`).replace("online", `Çevrimiçi`).replace("idle", `Boşta`).replace("offline", `Çevrimdışı/Görünmez`) : `Çevrimdışı/Görünmez`
        let Cihaz = {
            web: 'İnternet Tarayıcısı (💿)',
            desktop: 'Bilgisayar (💻)',
            mobile: 'Mobil (📱)'
        }
        const roles = member.roles.cache.filter(role => role.id !== message.guild.id).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
        const rolleri = []
        if (roles.length > 6) {
            const lent = roles.length - 6
            let itemler = roles.slice(0, 6)
            itemler.map(x => rolleri.push(x))
            rolleri.push(`${lent} daha...`)
        } else {
            roles.map(x => rolleri.push(x))
        }
        let mic = member.voice.selfMute ? `${emojis.iptal}` : `${emojis.onay}`
        let kulak = member.voice.selfDeaf ? `${emojis.iptal}` : `${emojis.onay}`

        let clientStatus;
        if (member.presence && member.presence.status !== 'offline') { clientStatus = `${Cihaz[Object.keys(member.presence.clientStatus)[0]]}` } else { clientStatus = 'Çevrimdışı/Görünmez (🔘)' }
        let kb = `
${emojis.nokta} \`ID:\` ${member.user.id} 
${emojis.nokta} \`Profil:\` <@!${member.user.id}>
${emojis.nokta} \`Durum:\` ${status}
${emojis.nokta} \`Bağlandığı Cihaz:\` ${clientStatus}
${emojis.nokta} \`Ceza Puanı:\` ${cezapuanData ? cezapuanData.cezapuan : 0} (Toplam ${cezapuanData ? cezapuanData.cezasayi.length : 0} Ceza)
${emojis.nokta} \`Oluşturma Tarihi:\` ${new Date(member.user.createdTimestamp).toTurkishFormatDate()}
        `
        let ub = `
${emojis.nokta} \`Sunucudaki Adı:\` ${member.displayName}
${emojis.nokta} \`Katılım Tarihi:\` ${new Date(member.joinedTimestamp).toTurkishFormatDate()}
${emojis.nokta} \`Katılım Sırası:\` ${(message.guild.members.cache.filter(a => a.joinedTimestamp <= member.joinedTimestamp).size).toLocaleString()}/${(message.guild.memberCount).toLocaleString()}
${emojis.nokta} \`Kayıt Tarihi:\` ${teyit.map(e => `${new Date(e.date).toTurkishFormatDate()}`)}
${emojis.nokta} \`Kayıt Eden Yetkili:\` ${teyit.map(e => `<@${e.userID}>`)}
${emojis.nokta} \`Cinsiyet:\` ${teyit.map(e => `<@&${e.Cinsiyet}>`)}
${emojis.nokta} \`Bazı Rolleri (${roles.length}):\` ${rolleri.join(", ") + ""} 
        `
        const bilgi = new Discord.MessageEmbed().setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true })).setThumbnail(member.user.avatarURL()).setColor("RANDOM")
            .setDescription(`${member} (${member.roles.highest}) isimli kullanıcının üyelik ve kullanıcı bilgileri`)
            .addFields(
                { name: '❯ Kullanıcı Bilgisi', value: `${kb}`, inline: true },
                { name: '❯ Üyelik Bilgisi', value: `${ub}`, inline: false },
            )
            .setTimestamp().setFooter(`Developed By Aris.`);
        if (member.voice.channel) {
            let sesb = `
${emojis.nokta} \`Bulunduğu Kanal:\` <#${member.voice.channel.id}>
${emojis.nokta} \`Kulaklık Durumu:\` ${kulak}
${emojis.nokta} \`Mikrofon Durumu:\` ${mic}
            `
            bilgi.addFields(
                { name: '❯ Sesli Bilgisi', value: `${sesb}`, inline: false }
            )
        }
        message.reply({ embeds: [bilgi] });
    }
}

module.exports = Bilgi