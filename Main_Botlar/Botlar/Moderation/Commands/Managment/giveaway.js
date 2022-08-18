const { ariscik, cekilis } = require('../../../../Helpers/Schemas')
const moment = require("moment");
const ms = require("ms")
class Giveaway extends Command {
  constructor(client) {
    super(client, {
      name: "çekiliş",
      aliases: ["giveaway", "gstart", "ç"],
      cooldown: 10
    });
  }
  async run(client, message, args, embed) {
    const aris = await ariscik.findOne({ guildID: message.guild.id })
    if (!config.Founders.includes(message.author.id) && !config.root.includes(message.author.id) && !aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has("ADMINISTRATOR") && !message.member.roles.cache.has("992118582622310440")) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)] }).sil(15)
    let zaman = args[0]
    let kazanan = args[1]
    let odul = args.slice(2).join(" ");
    let arr = [];
    if (!zaman) return message.channel.send({ content: `\`HATA!\` Lütfen komutu doğru kullanın! \`.çekiliş 10m 1 Netflix\`` })
    if (!kazanan) return message.channel.send({ content: `\`HATA!\` Lütfen komutu doğru kullanın! \`.çekiliş 10m 1 Netflix\`` })
    if (isNaN(kazanan)) return message.channel.send({ content: `\`HATA!\` Lütfen komutu doğru kullanın! \`.çekiliş 10m 1 Netflix\`` })
    if (kazanan > 1) return message.channel.send({ content: `\`HATA!\` Şuanlık sadece 1 kazanan belirleyebilirsiniz!` })
    if (!odul) return message.channel.send({ content: `\`HATA!\` Lütfen komutu doğru kullanın! \`.çekiliş 10m 1 Netflix\`` })
    let sure = ms(zaman)
    let kalan = Date.now() + sure
    if (message) message.delete();
    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton().setCustomId("katil").setEmoji("989311021736923147").setStyle("PRIMARY")
    )
    let msg = await message.channel.send({
      embeds: [embed.setTitle(`${odul}`).setFooter(`${kazanan} Kazanan!`).setDescription(`
Çekiliş başladı! Aşağıdaki butona basarak katılabilirsiniz!
Çekilişi Başlatan : ${message.author}
Bitiş Zamanı : <t:${Math.floor(kalan / 1000)}:R>
        `)], components: [row]
    })

    setTimeout(() => {
      if (arr.length <= 1) {
        if (msg) msg.edit({
          embeds: [new Discord.MessageEmbed().setTitle(`${odul}`).setDescription(`
Çekilişe katılım olmadığından çekiliş iptal edildi!
`)], components: []
        })
        return;
      }
      let random = arr[Math.floor(Math.random() * arr.length)]
      message.channel.send({ content: `<@${random}> tebrikler kazandın!` })
      if (msg) msg.edit({
        embeds: [new Discord.MessageEmbed().setTitle(`${odul}`).setFooter(`${arr.length} katılımcı!`).setDescription(`
Çekiliş sonuçlandı! 
Çekilişi Başlatan : ${message.author} 
Kazanan : <@${random}>
                    `)], components: []
      })
    }, sure)

    let collector = await msg.createMessageComponentCollector({})
    collector.on("collect", async (button) => {
      button.deferUpdate(true)
      if (button.customId == "katil") {
        let tikdata = await cekilis.findOne({ messageID: button.message.id })
        if (tikdata?.katilan.includes(button.member.id)) return;
        await cekilis.findOneAndUpdate({ messageID: button.message.id }, { $push: { katilan: button.member.id } }, { upsert: true })
        arr.push(button.member.id)
        if (msg) msg.edit({
          embeds: [new Discord.MessageEmbed().setColor("RANDOM").setTitle(`${odul}`).setFooter(`${kazanan} Kazanan!`).setDescription(`
Çekiliş başladı! Aşağıdaki butona basarak katılabilirsiniz!
Çekilişi Başlatan : ${message.author}
Katılan kişi sayısı : ${tikdata?.katilan.length + 1 || 1}
Bitiş Zamanı : <t:${Math.floor(kalan / 1000)}:R>
                            `)]
        })
      }
    })
  }
}

module.exports = Giveaway