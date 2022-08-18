const { ariscik, Penalties, Users, coin } = require('../../../../Helpers/Schemas')
class Woman extends Command {
    constructor(client) {
        super(client, {
            name: "kadın",
            aliases: ["woman", "kız", "kadın", "k"],
            cooldown: 15
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (message.channel.id !== aris.welcomeChannel) return message.reply(`**UYARI:** Bu komutu yalnızca <#${aris.welcomeChannel}> kanalında kullanabilirsin!`).sil(10)
        if (!message.member.roles.cache.has(aris.registerHammer) && !config.Founders.includes(message.author.id) && !config.root.includes(message.author.id) && !aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)] }).sil(15)
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        args = args.filter(a => a !== "" && a !== " ").splice(1); let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase() + arg.slice(1)).join(" "); let yaş = args.filter(arg => !isNaN(arg))[0]
        if (!member) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir üye belirtmeyi unuttun!`)] }).sil(10);
        if (member.roles.cache.has(aris.cezalıRol)) return message.channel.send({ embeds: [embed.setDescription(`**UYARI : **Bu üye cezalı olduğu için işlemi tamamlayamadım!`)] }).sil(10)
        if (aris.manRoles.some(role => member.roles.cache.has(role)) || aris.womanRoles.some(role => member.roles.cache.has(role))) return message.channel.send({ embeds: [embed.setDescription(`**UYARI : **Bu üye zaten sunucumuzda kayıtlı!`)] }).sil(10)
        if (aris.tagliAlim === true && !member.user.username.includes(aris.tag) && !member.roles.cache.has(aris.vipRol) && !member.roles.cache.has(aris.boosterRol)) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Sunucumuz şuanda taglı alımda olduğu için işlemi gerçekleştiremiyorum!`).setFooter(`Üyeyi VIP olarak kaydetmek için : .vip`)] }).sil(50)
        if (member.user.bot) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir botu kayıt edemezsin!`)] }).sil(10)
        if (!member.manageable) return message.channel.send({ embeds: [embed.setDescription(`**UYARI : **Bu üyeyi kayıt etmek için yetkim yetersiz!`)] }).sil(10)
        if (!isim) return message.channel.send({ embeds: [embed.setDescription(`**UYARI : **Kayıt edilecek kişi için bir isim belirtmelisin!`)] }).sil(10)
        if (!yaş) return message.channel.send({ embeds: [embed.setDescription(`**UYARI : **Kayıt edilecek kişi için bir yaş belirtmelisin!`)] }).sil(10)
        let setName;
        setName = `${aris.tags.some(tag => member.user.username.includes(tag)) || member.user.discriminator == aris.tags.filter(t => t.startsWith("#")) ? aris.isimsembol : (aris.isimsemboliki ? aris.isimsemboliki : aris.isimsembol)} ${isim} | ${yaş}`
        if (setName.length > 32) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Discord API sınırına ulaşıldı!`)] }).sil(10)
        const cezapuanData = await Penalties.findOne({ guildID: message.guild.id, userID: member.user.id });
        await member.setNickname(`${setName}`, `Kadın Kayıt, Yetkili: ${message.author.id}`); await member.roles.remove([aris.unregisterRole]); await member.roles.add(aris.womanRoles)
        message.channel.send({ embeds: [embed.setTimestamp().setFooter(`Üyenin Ceza Puanı : ${cezapuanData ? cezapuanData.cezapuan : 0}`).setDescription(`${member} üyesi sunucumuza \`Kadın\` olarak kayıt edildi!`)] }).sil(30); if (message) message.react(emojis.onay)
        await Users.findOneAndUpdate({ userID: message.author.id }, { $inc: { TeyitNo: 1 } }, { upsert: true }).exec(); await Users.findOneAndUpdate({ userID: message.author.id }, { $push: { Teyitler: { userID: member.id, rol: aris.womanRoles[0], date: Date.now(), Gender: "Kadın" } } }, { upsert: true }); await Users.findOneAndUpdate({ userID: member.id }, { $push: { Names: { userID: message.author.id, Name: `${setName}`, rol: aris.womanRoles[0], islem: "Kayıt" } } }, { upsert: true }); await Users.findOneAndUpdate({ userID: member.id }, { $set: { Teyitci: { userID: message.author.id, Cinsiyet: aris.womanRoles[0], date: Date.now() } } }, { upsert: true }); if (aris.coinSystem === true) await coin.findOneAndUpdate({ guildID: member.guild.id, userID: author.id }, { $inc: { coin: config.registerCoin } }, { upsert: true }); message.member.updateTask(message.guild.id, "kayıt", 1, message.channel);
        //const row = new Discord.MessageActionRow().addComponents( new Discord.MessageButton().setCustomId('hosgeldin').setLabel("Selam Vermek İçin El Salla!").setEmoji("927619326868082781").setStyle('SECONDARY'), );
        let hosgeldinmsg = await client.channels.cache.get(aris.genelChat).send({ content: `${member} aramıza hoş geldin! Sunucumuz seninle birlikte **${member.guild.memberCount}** kişi oldu!` }).sil(20)
        //var filter = (button) => button.user.id !== member.id; const collector = hosgeldinmsg.createMessageComponentCollector({ filter, time: 10000 })
        //collector.on('collect', async (button, user) => { if(button.customId === "hosgeldin") { button.reply({ content : `Selamın başarılı bir şekilde iletildi! ${emojis.onay}`, ephemeral: true}); button.channel.send(`${member} \`${button.user.username}\` kişisi tarafından selamlandın!`).sil(10) } collector.on("end", async (collected, reason) => { if(hosgeldinmsg) hosgeldinmsg.delete(); }); })
    }
}

module.exports = Woman