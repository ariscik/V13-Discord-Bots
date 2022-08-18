const { ariscik } = require('../../../../Helpers/Schemas')
class Cek extends Command {
    constructor(client) {
        super(client, {
            name: "çek",
            aliases: ["çek", "cek"],
            cooldown: 15
        });
    }
    //return message.channel.send({ embeds: [embed.setDescription(`**UYARI :**`)]})
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!message.member.voice.channel) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir ses kanalında olman gerekli!`)] }).sil(10)
        if (!member) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir üye belirtmen gerekli!`)] }).sil(10)
        if (message.member.id == member.id) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Kanala çekmeye çalıştığın kişi kendin olamazsın!`)] }).sil(20)
        if (message.member.voice.channel == member.voice.channel) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Belirttiğin üye ile zaten aynı kanaldasınız!`)] }).sil(20)
        if (!member.voice.channel) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Belirttiğin üye bir ses kanalında bulunmuyor!`)] }).sil(20)
        if (member.user.bot) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir botu çekmeye çalışamazsın!`)] }).sil(20)
        if (aris.yonetimRoles.some(x => message.member.roles.cache.has(x)) || config.root.includes(message.author.id) || message.member.roles.cache.has(aris.moveHammer)) {
            member.voice.setChannel(message.member.voice.channel.id)
            message.channel.send({ embeds: [embed.setDescription(`${member}, adlı kullanıcı <#${member.voice.channel.id}> kanalından <#${message.member.voice.channel.id}> kanalına ${message.author} adlı yetkili tarafından çekildi ${emojis.onay}`)] }).sil(40)
        } else {
            const row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('cekonayla')
                        .setLabel("✅")
                        .setStyle('SUCCESS'),
                    new Discord.MessageButton()
                        .setCustomId('cekreddet')
                        .setLabel("❌")
                        .setStyle('DANGER'),
                );
            let msg = await message.channel.send({ components: [row], content: `${member}`, embeds: [new Discord.MessageEmbed().setColor("RANDOM").setAuthor(message.author.username, message.author.avatarURL({ dynamic: true })).setTimestamp().setFooter(`Developed By Aris.`, client.user.avatarURL({ dynamic: true })).setDescription(`Hey! ${member}, ${message.author} adlı kullanıcı seni \`${message.member.voice.channel.name}\` odasına çekmek istiyor.\nKabul ediyor musun?`).setFooter("İstek 30 saniye içinde onaylanmazsa otomatik olarak iptal edilecektir.")] })
            var filter = (button) => button.user.id === member.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 30000 })
            collector.on('collect', async (button, user) => {
                if (button.customId === "cekonayla") {
                    if (msg) msg.delete().catch(err => { });
                    await member.voice.setChannel(message.member.voice.channel.id)
                    await message.reply({ embeds: [embed.setDescription(`${message.author}, ${member} Adlı kullanıcı senin çekme isteğini onayladı. ${emojis.onay}\nBulunduğu kanal <#${message.member.voice.channel.id}>.`)] }).sil(20)
                } else if (button.customId === "cekreddet") {
                    if (msg) msg.delete().catch(err => { });
                    message.reply({ embeds: [embed.setDescription(`${message.author}, ${member} Adlı kullanıcı senin odaya çekme isteğini onaylamadı.`)] }).sil(20)
                }
            });
            collector.on("end", async (collected, reason) => {
                if (reason === "time") {
                    if (msg) msg.delete().catch(err => { });
                    message.reply({ embeds: [embed.setDescription(`${member}, 30 saniye boyunca cevap vermediği için işlem iptal edildi.`)] }).sil(10)
                }
            });
        }
    }
}

module.exports = Cek