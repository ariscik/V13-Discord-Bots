const { ariscik } = require('../../../../Helpers/Schemas')
class YSay extends Command {
    constructor(client) {
        super(client, {
            name: "ysay",
            aliases: ["yetkilisay", "yetkilises"],
            cooldown: 20
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!["961734572599558164","961734580421951489"].some(x => message.member.roles.cache.has(x)) && !config.Founders.includes(message.author.id) && !config.root.includes(message.author.id) && !aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)] }).sil(15)
        var yetkilisayısı = message.guild.members.cache.filter(yetkili => yetkili.roles.cache.has(aris.registerHammer)).size
        var sesdekiler = message.guild.members.cache.filter(yetkili => yetkili.roles.cache.has(aris.registerHammer)).filter(yetkilises => yetkilises.voice.channel).size
        var atkifler = message.guild.members.cache.filter(yetkili => yetkili.roles.cache.has(aris.registerHammer) && yetkili.presence && yetkili.presence.status !== "offline").size
        let sesdeolmayanlar = message.guild.members.cache.filter(yetkili => yetkili.roles.cache.has(aris.registerHammer)).filter(yetkilises => !yetkilises.voice.channel && yetkilises.presence && yetkilises.presence.status != "offline")
        const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId('sesolmayan').setLabel("Seste Olmayan Yetkililer").setStyle('DANGER'), new Discord.MessageButton().setCustomId('sesteolmayandm').setLabel("Dm Duyuru").setStyle('DANGER'));
        let ysay = await message.channel.send({ embeds: [embed.setDescription(`Sunucumuzdaki toplam yetkili sayısı: **${yetkilisayısı}**\nSunucumuzdaki toplam aktif yetkili sayısı: **${atkifler}**\nSesdeki toplam yetkili sayısı: **${sesdekiler}**`)], components: [row] })
        var filter = (button) => button.user.id === message.author.id;
        const collector = ysay.createMessageComponentCollector({ filter, time: 30000 })
        collector.on('collect', async (button, user) => {
            if (button.customId === "sesolmayan") {
                await button.reply({ content: `${emojis.onay} Seste olmayan yetkililer etiketlenmiştir!`, ephemeral: true })
                button.channel.send({ content: `Sesde olmayan yetkililer ; \n\n${sesdeolmayanlar.map(yetkili => `${yetkili}`).join(', ')}` })
            }
            if (button.customId === "sesteolmayandm") {
                await button.reply({ content: `${emojis.onay} Seste olmayan yetkililere dm üzerinden mesaj gönderilmiştir!`, ephemeral: true })
                message.guild.members.cache.filter(yetkili => yetkili.roles.cache.has(aris.registerHammer)).filter(yetkilises => !yetkilises.voice.channel && yetkilises.presence && yetkilises.presence.status != "offline").forEach(user => { user.send(`Merhabalar. **${message.guild.name}** sunucusunda ses aktifliğinizi artırmak ve yetkinizi yükseltmek için seslere giriniz. Müsait değil isen **Sleep Room** kanalına afk bırakabilirsin.`).catch(err => { message.channel.send(`${user} isimli yetkiliye özel mesajları kapalı olduğu için mesaj atamıyorum. Lütfen seslere geçebilir misin ? Müsait değilsen **Sleep Room** kanalına geçebilirsin.`) }) })
            }
        })
    }
}

module.exports = YSay