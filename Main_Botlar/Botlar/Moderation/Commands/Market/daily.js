const { ariscik, coins } = require('../../../../Helpers/Schemas')
class Daily extends Command {
    constructor(client) {
        super(client, {
            name: "günlük",
            aliases: ["daily", "gunluk", "maas", "maaş"],
            cooldown: 20
        });
    }
    async run(client, message, args, embed) {
        let Hesap = await coins.findOne({ userID: message.member.id })
        if (Hesap && Hesap.GunlukCoin) {
            let yeniGün = Hesap.GunlukCoin + (1 * 24 * 60 * 60 * 1000);
            if (Date.now() < yeniGün) {
                message.react(emojis.iptal)
                return message.channel.send({ content: `${emojis.iptal} Tekrardan günlük ödül alabilmen için <t:${Math.floor(yeniGün / 1000)}:R> beklemen gerekiyor.` }).sil(20)
            }
        }
        let Günlük = Math.random();
        Günlük = Günlük * (500 - 200);
        Günlük = Math.floor(Günlük) + 200
        await coins.updateOne({ userID: message.member.id }, { $set: { "GunlukCoin": Date.now() }, $inc: { "Coin": Günlük } }, { upsert: true }).exec();
        await message.react(emojis.onay)
        await message.channel.send({ embeds: [embed.setDescription(`${emojis.onay} ${message.member} başarıyla \`${Günlük}\` coin ödülünü aldın. **24 Saat** sonra tekrardan ödülünü alabileceksin.`)] }).sil(100)
    }
}

module.exports = Daily