const { ariscik } = require('../../../../Helpers/Schemas')
class Control extends Command {
    constructor(client) {
        super(client, {
            name: "kontrol",
            aliases: ["control", "tk"],
            cooldown: 30
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!config.Founders.includes(message.author.id) && !config.root.includes(message.author.id) && !aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)] }).sil(15)
        let tagges = message.guild.members.cache.filter(member => !member.user.bot && aris.tags.some(tag => member.user.username.includes(tag) || member.user.discriminator == aris.tags.filter(discrim => !isNaN(discrim))[0]) && !member.roles.cache.has(aris.tagRol))
        let etk = message.guild.members.cache.filter(member => !member.roles.cache.has(aris.etkinlikRole) && !member.user.bot).size;
        let cek = message.guild.members.cache.filter(member => !member.roles.cache.has(aris.cekilisRole) && !member.user.bot).size;
        const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId('etkinlikdagit').setLabel("Etkinlik K. Dağıt").setStyle('DANGER'), new Discord.MessageButton().setCustomId('cekilisdagit').setLabel("Çekiliş K. Dağıt").setStyle('DANGER'), new Discord.MessageButton().setCustomId('tagrol').setLabel("Tag Rolü Dağıt").setStyle('DANGER'));
        let ysay = await message.channel.send({ embeds: [embed.setDescription(`Merhaba! ${message.guild.name} sunucu içerisi kontrol ekranına hoş geldin!\n\n${emojis.star} Tagı olup rolü olmayan kulanıcı sayısı : ${tagges.size}\n${emojis.star} Etkinlik katılımcısı rolü olmayan kullanıcı sayısı: ${etk}\n${emojis.star} Çekiliş katılımıcısı rolü olmayan kullanıcı sayısı: ${cek}\n\nRolleri dağıtmak için uygun butona tıklamanız yeterli!`)], components: [row] })
        var filter = (button) => button.user.id === message.author.id;
        const collector = ysay.createMessageComponentCollector({ filter, time: 30000 })
        collector.on('collect', async (button, user) => {
            if (button.customId === "etkinlikdagit") {
                await button.reply({ content: `${emojis.onay} Etkinlik Katılımcısı rolü olmayan **${etk}** kişiye rol dağıtılıyor.`, ephemeral: true })
                button.guild.members.cache.filter(member => !member.roles.cache.has(aris.etkinlikRole) && !member.user.bot).forEach(x => x.roles.add(aris.etkinlikRole));
            }
            if (button.customId === "cekilisdagit") {
                await button.reply({ content: `${emojis.onay} Çekiliş Katılımcısı rolü olmayan **${cek}** kişiye rol dağıtılıyor.`, ephemeral: true })
                button.guild.members.cache.filter(member => !member.roles.cache.has(aris.cekilisRole) && !member.user.bot).forEach(x => x.roles.add(aris.cekilisRole));
            }
            if (button.customId === "tagrol") {
                button.guild.members.cache.filter(member => !member.user.bot && aris.tags.some(tag => member.user.username.includes(tag)) || member.user.discriminator == aris.tags.filter(discrim => !isNaN(discrim))[0] && !member.roles.cache.has(aris.tagRol)).forEach(x => x.roles.add(aris.tagRol))
                await button.reply({ content: `${emojis.onay} Tagı olup rolü olmayan **${tagges.size}** kişiye rol dağıtılıyor.` })
            } 
        })
    }
}

module.exports = Control