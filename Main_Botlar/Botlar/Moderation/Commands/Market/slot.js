const { ariscik, coins } = require('../../../../Helpers/Schemas')
const moment = require("moment");
require("moment-duration-format");
const Beklet = new Set();
class Slot extends Command {
    constructor(client) {
        super(client, {
            name: "slot",
            aliases: ["s"],
            cooldown: 20
        });
    }
    async run(client, message, args, embed) {
        if (Beklet.has(message.author.id)) return message.channel.send({ content: `\`Flood!\` Lütfen bir kaç saniye sonra tekrar oynamayı deneyin.` }).sil(20)
        let Hesap = await coins.findOne({ userID: message.member.id })
        let Coin = Hesap ? Hesap.Coin : 0
        let Miktar = Number(args[0]);
        if (args[0] == "all") {
            if (Coin >= 250000) Miktar = 250000
            if (Coin < 250000) Miktar = Coin
            if (Coin <= 0) Miktar = 10
        }
        Miktar = Miktar.toFixed(0);
        if (isNaN(Miktar)) return message.channel.send({ content: `Miktar yerine harf kullanmamayı tavsiye ederim.` }).sil(10)
        if (Miktar <= 0) return message.channel.send({ content: `Göndermek istediğiniz miktar, birden küçük olamaz.` }).sil(10)
        if (Miktar > 250000) return message.channel.send({ content: `Bahise en fazla \`250.000\` coin ile girilebilir.` }).sil(10)
        if (Miktar < 10) return message.channel.send({ content: `Bahise en az \`10\` coin ile girebilirsiniz.` }).sil(10)
        if (Coin < Miktar) return message.channel.send({ content: `\`Belirtiğiniz miktar kadar yeterince bakiye olmadığından dolayı bahse giremezsiniz.\`` }).sil(10)
        let ArisSlot = ["🍓", "🍌", "🍒"];
        var SlotOne = ArisSlot.random()
        var SlotTwo = ArisSlot.random()
        var SlotThree = ArisSlot.random()
        await coins.updateOne({ userID: message.member.id }, { $inc: { Coin: -Miktar } }).exec();
        Beklet.add(message.author.id);
        message.channel.send({ embeds: [embed.setDescription(`🎰 ${message.author}, \`${Miktar}\` coin ile slot döndürülüyor... (\`🔘:🔘:🔘\`)`)] }).then(msg => {
            if (SlotOne === SlotTwo && SlotOne === SlotThree) {
                setTimeout(async () => {
                    Miktar = Number(Miktar);
                    let coin = Miktar * 4;
                    await coins.updateOne({ userID: message.member.id }, { $inc: { Coin: Number(coin) } }).exec();
                    msg.edit({ embeds: [embed.setDescription(`🎰 ${message.author}, \`${Miktar}\` coin ile slot oynadın ve \`${coin}\` coin kazandın. (\`${SlotOne}:${SlotTwo}:${SlotThree}\`)`)] });
                    Beklet.delete(message.author.id);
                }, 2500);
            } else {
                setTimeout(async () => {
                    msg.edit({ embeds: [embed.setDescription(`🎰 ${message.author}, \`${Miktar}\` coin ile slot oynadın fakat **kaybettin**. (\`${SlotOne}:${SlotTwo}:${SlotThree}\`)`)] });
                    Beklet.delete(message.author.id);
                }, 2500);
            }
        });
    }
}

module.exports = Slot