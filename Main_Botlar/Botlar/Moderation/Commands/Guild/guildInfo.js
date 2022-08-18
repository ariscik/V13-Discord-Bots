const { ariscik } = require('../../../../Helpers/Schemas')
class GuildInfo extends Command {
    constructor(client) {
        super(client, {
            name: "guilinfo",
            aliases: ["sb", "sv"],
            Founder: true
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        let zort = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton().setCustomId("ydetay").setLabel("Yetki Detay").setStyle("PRIMARY"),
            new Discord.MessageButton().setCustomId("sgiris").setLabel("Sunucu Giriş").setStyle("PRIMARY")
        )
        let yetkili = message.guild.members.cache.filter(yetkili => yetkili.roles.cache.has(aris?.registerHammer)).size

        let yoneticiler = message.guild.roles.cache.filter(x => x.permissions.has("ADMINISTRATOR")).size
        let kişiler = message.guild.roles.cache.filter(x => x.permissions.has("ADMINISTRATOR")).map(a => `<@&${a.id}>`).join(" , ")

        let url = message.guild.roles.cache.filter(x => x.permissions.has("MANAGE_GUILD")).size
        let k1 = message.guild.roles.cache.filter(x => x.permissions.has("MANAGE_GUILD")).map(a => `<@&${a.id}>`).join(" , ")

        let ryt = message.guild.roles.cache.filter(x => x.permissions.has("MANAGE_ROLES")).size
        let k2 = message.guild.roles.cache.filter(x => x.permissions.has("MANAGE_ROLES")).map(a => `<@&${a.id}>`).join(" , ")

        let kyt = message.guild.roles.cache.filter(x => x.permissions.has("MANAGE_CHANNELS")).size
        let k3 = message.guild.roles.cache.filter(x => x.permissions.has("MANAGE_CHANNELS")).map(a => `<@&${a.id}>`).join(" , ")

        let yonetici = []
        message.guild.roles.cache.filter(x => x.permissions.has("ADMINISTRATOR")).forEach(a => message.guild.roles.cache.get(a.id).members.filter(e => !e.user.bot).map(a => yonetici.push(`<@${a.id}>`)))

        let urlsunucu = []
        message.guild.roles.cache.filter(x => x.permissions.has("MANAGE_GUILD")).forEach(a => message.guild.roles.cache.get(a.id).members.filter(e => !e.user.bot).map(a => urlsunucu.push(`<@${a.id}>`)))

        let rolyonet = []
        message.guild.roles.cache.filter(x => x.permissions.has("MANAGE_ROLES")).forEach(a => message.guild.roles.cache.get(a.id).members.filter(e => !e.user.bot).map(a => rolyonet.push(`<@${a.id}>`)))

        let kanalyonet = []
        message.guild.roles.cache.filter(x => x.permissions.has("MANAGE_ROLES")).forEach(a => message.guild.roles.cache.get(a.id).members.filter(e => !e.user.bot).map(a => kanalyonet.push(`<@${a.id}>`)))

        let sonbirsaat = message.guild.members.cache.filter(a => (new Date().getTime() - a.joinedTimestamp) < 3600000).size

        let sonbirgun = message.guild.members.cache.filter(a => (new Date().getTime() - a.joinedTimestamp) < 86400000).size

        let sonbirhafta = message.guild.members.cache.filter(a => (new Date().getTime() - a.joinedTimestamp) < 604800000).size

        message.guild.fetchVanityData().then(async res => {
            let msg = await message.channel.send({
                embeds: [embed.setDescription(`
\`\`\`SUNUCU - KONTROL\`\`\`
Taç Sahip: <@${message.guild.ownerId}> (\`${message.guild.ownerId}\`) 
Sunucu URL: https://discord.gg/${res.code} - Kullanım **${res.uses}**
Kuruluş Tarihi: <t:${Math.floor(message.guild.createdAt / 1000)}:R>
Rol Sayısı: **${message.guild.roles.cache.size}** / Kanal Sayısı: **${message.guild.channels.cache.size}**
Yetkili Sayısı: **${yetkili}**
\`\`\`YETKİ - KONTROL\`\`\`
${yoneticiler} rolde [**Yönetici**] yetkisi açık! Roller Şu Şekildedir;
${kişiler}
**────────────────────────**
${url} rolde [**Url/Sunucu Yönet**] yetkisi açık! Roller Şu Şekildedir;
${k1}
**────────────────────────**
${ryt} rolde [**Rol Yönet**] yetkisi açık! Roller Şu Şekildedir;
${k2}
**────────────────────────**
${kyt} rolde [**Kanal Yönet**] yetkisi açık! Roller Şu Şekildedir;
${k3}
**────────────────────────**
`)], components: [zort]
            })
            var filter = (button) => button.user.id === message.member.id;
            let collector = await msg.createMessageComponentCollector({ filter })

            collector.on("collect", async (button) => {
                if (button.customId == "ydetay") {
                    button.reply({
                        embeds: [embed.setDescription(`
\`\`\`cs
[YÖNETİCİ] yetkisine sahip olan (${yonetici.length}) kişilerin listesi;\`\`\`
${yonetici ? yonetici.map(arisciks => `${arisciks}`).join(' , ') : "Rolde bulunan kimse yok!"}
**────────────────────────**
\`\`\`cs
[URL/SUNUCU YÖNET] yetkisine sahip olan (${urlsunucu.length}) kişilerin listesi;\`\`\`
${urlsunucu ? urlsunucu.map(arisciks => `${arisciks}`).join(' , ') : "Rolde bulunan kimse yok!"}
**────────────────────────**
\`\`\`cs
[ROL YÖNET] yetkisine sahip olan (${rolyonet.length}) kişilerin listesi;\`\`\`
${rolyonet ? rolyonet.map(arisciks => `${arisciks}`).join(' , ') : "Rolde bulunan kimse yok!"}
**────────────────────────**
\`\`\`cs
[KANAL YÖNET] yetkisine sahip olan (${kanalyonet.length}) kişilerin listesi;\`\`\`
${kanalyonet ? kanalyonet.map(arisciks => `${arisciks}`).join(' , ') : "Rolde bulunan kimse yok!"}
**────────────────────────**
                `)],
                        ephemeral: true
                    })
                }
                if (button.customId == "sgiris") {
                    button.reply({
                        embeds: [embed.setDescription(`
\`\`\`SUNUCU GİRİŞ BİLGİLERİ\`\`\`
Sunucumuzda toplam ${message.guild.memberCount} üye bulunmakta!

Son **1 SAAT** içerisinde sunucumuza **${sonbirsaat}** adet kullanıcı giriş yapmış.

Son **1 GÜN** içerisinde sunucumuza **${sonbirgun}** adet kullanıcı giriş yapmış.

Son **1 HAFTA** içerisinde sunucumuza **${sonbirhafta}** adet kullanıcı giriş yapmış.
                `)],
                        ephemeral: true
                    })
                }
            })
        })
    }
}

module.exports = GuildInfo