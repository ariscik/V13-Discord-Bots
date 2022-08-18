class Git extends Command {
    constructor(client) {
        super(client, {
            name: "git",
            aliases: ["git", "gıt"],
            cooldown: 15
        });
    }
    async run(client, message, args, embed) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!message.member.voice.channel) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir ses kanalında olman gerekli!`)] }).sil(10)
        if (!member) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir üye belirtmen gerekli!`)] }).sil(10)
        if (message.member.id == member.id) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Kanalına gitmeye çalıştığın kişi kendin olamazsın!`)] }).sil(20)
        if (message.member.voice.channel == member.voice.channel) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Belirttiğin üye ile zaten aynı kanaldasınız!`)] }).sil(20)
        if (!member.voice.channel) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Belirttiğin üye bir ses kanalında bulunmuyor!`)] }).sil(20)
        if (member.user.bot) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir botun yanına gitmeye çalışamazsın!`)] }).sil(20)
        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('gitonayla')
                    .setLabel("✅")
                    .setStyle('SUCCESS'),
                new Discord.MessageButton()
                    .setCustomId('gitreddet')
                    .setLabel("❌")
                    .setStyle('DANGER'),
            );
        let msg = await message.channel.send({ components: [row], content: `${member}`, embeds: [new Discord.MessageEmbed().setColor("RANDOM").setAuthor(message.author.username, message.author.avatarURL({ dynamic: true })).setTimestamp().setFooter(`Developed By Aris.`, client.user.avatarURL({ dynamic: true })).setDescription(`Hey! ${member}, ${message.author} adlı kullanıcı \`${member.voice.channel.name}\` odasına gelmek istiyor.\nKabul ediyor musun?`).setFooter("İstek 30 saniye içinde onaylanmazsa otomatik olarak iptal edilecektir.")] })
        var filter = (button) => button.user.id === member.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 30000 })
        collector.on('collect', async (button, user) => {
            if (button.customId === "gitonayla") {
                if (msg) msg.delete().catch(err => { });
                await message.member.voice.setChannel(member.voice.channel.id)
                await message.reply({ embeds: [embed.setDescription(`${message.author}, ${member} Adlı kullanıcı senin odaya gelme isteğini onayladı. ${emojis.onay}\nBulunduğu kanal <#${member.voice.channel.id}>.`)] }).sil(20)
            } else if (button.customId === "gitreddet") {
                if (msg) msg.delete().catch(err => { });
                message.reply({ embeds: [embed.setDescription(`${message.author}, ${member} Adlı kullanıcı senin odaya gelme isteğini onaylamadı.`)] }).sil(20)
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

module.exports = Git