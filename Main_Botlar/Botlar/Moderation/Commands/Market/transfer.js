const { ariscik, coins } = require('../../../../Helpers/Schemas')
class Transfer extends Command {
    constructor(client) {
        super(client, {
            name: "transfer",
            aliases: ["gönder", "coingönder", "cg", "tr"],
            cooldown: 20
        });
    }
    async run(client, message, args, embed) {
        let Hesap = await coins.findOne({ userID: message.member.id })
        let Coin = Hesap ? Hesap.Coin : 0
        let Gönderilen = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!Gönderilen) return message.channel.send({ content: `Bir üye belirtmeyi unuttun!` }).sil(20)
        let Miktar = Number(args[1]);
        if (isNaN(Miktar)) return message.channel.send({ content: 'Hata: `Lütfen miktar yerine harf girmeyin rakam kullanın.`' }).sil(20)
        Miktar = Miktar.toFixed(0);
        if (Miktar <= 0) return message.channel.send({ content: 'Hata: `Göndermek istediğiniz miktar 1 dan küçük olamaz.`' }).sil(20)
        if (Coin < Miktar) return message.channel.send({ content: 'Hata: `Maalesef yeterli bakiyen bulunamadı.`' }).sil(20)
        await coins.updateOne({ userID: message.member.id }, { $inc: { Coin: -Miktar } }, { upsert: true })
        await coins.updateOne({ userID: message.member.id }, { $push: { "Transferler": { Uye: Gönderilen.id, Tutar: Miktar, Tarih: Date.now(), Islem: "Gönderilen" } } }, { upsert: true })
        await coins.updateOne({ userID: Gönderilen.id }, { $push: { "Transferler": { Uye: message.member.id, Tutar: Miktar, Tarih: Date.now(), Islem: "Gelen" } } }, { upsert: true })
        await coins.updateOne({ userID: Gönderilen.id }, { $inc: { Coin: Miktar } }, { upsert: true })
        await message.react(emojis.onay)
        await message.channel.send({ embeds: [embed.setDescription(`${emojis.onay} ${Gönderilen} üyesine başarıyla \`${Miktar}\` coin gönderdin.`)] })

    }
}

module.exports = Transfer