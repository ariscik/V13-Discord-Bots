const { ariscik, coin } = require("../../../../Helpers/Schemas")
class SetRank extends Command {
    constructor(client) {
        super(client, {
            name: "rank",
            aliases: ["rank", "rankekle", "setrank"],
            Founder: true,
        });
    }
    async run(client, message, args, embed) {
        const coinDatas = await coin.findOne({ guildID: message.guild.id })
        const vcoin = args[1];
        if (!["ekle", "add", "sil", "delete", "temizle", "clear", "liste", "list"].includes(args[0])) return message.reply(`Bir argüman belirt! \`ekle - sil - temizle - liste\``).sil(50)
        if (["ekle", "add"].includes(args[0])) {
            if (!vcoin || isNaN(vcoin)) return message.reply("Eklenecek yetkinin coinini belirtmelisin!");
            if (coinDatas) {
                if (coinDatas.advancedRanks.some((x) => x.coin == vcoin)) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** \`${vcoin}\` coinine ulaşıldığında verilecek roller zaten ayarlanmış!`)] }).sil(30)
                const roles = [...message.mentions.roles.values()];
                if (!roles || !roles.length) return message.reply({ embeds: [embed.setDescription("Eklenecek yetkinin rol(leri) belirtmelisin!")] });
                await coin.findOneAndUpdate({ guildID: config.guildID }, { $push: { advancedRanks: { role: roles.map((x) => x.id), coin: parseInt(vcoin) } } }, { upsert: true })
                message.channel.send({ embeds: [embed.setDescription(`${vcoin} coine ulaşıldığında verilecek roller ayarlandı! \nVerilecek Roller: ${roles.map((x) => `<@&${x.id}>`).join(", ")}`)] });
            } else {
                const roles = [...message.mentions.roles.values()];
                if (!roles || !roles.length) return message.reply({ embeds: [embed.setDescription("Eklenecek yetkinin rol(leri) belirtmelisin!")] }).sil(20)
                await coin.findOneAndUpdate({ guildID: config.guildID }, { $push: { advancedRanks: { role: roles.map((x) => x.id), coin: parseInt(vcoin) } } }, { upsert: true })
                message.channel.send({ embeds: [embed.setDescription(`${vcoin} coine ulaşıldığında verilecek roller ayarlandı! \nVerilecek Roller: ${roles.map((x) => `<@&${x.id}>`).join(", ")}`)] });
            }
        } else if (["sil", "delete", "remove"].includes(args[0])) {
            if (!vcoin || isNaN(vcoin)) return message.reply({ embeds: [embed.setDescription("Silinecek yetkinin coinini belirtmelisin!")] });
            if (!coinDatas.advancedRanks.map((x) => x.coin == vcoin)) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** \`${vcoin}\` coinine ulaşıldığında verilecek roller ayarlanmamış!`)] }).sil(30)
            await coin.findOneAndUpdate({ $pull: { advancedRanks: { coin: parseInt(vcoin) } } });
            message.channel.send({ embeds: [embed.setDescription(`${vcoin} coine ulaşıldığında verilecek roller silindi!`)] });
        } else if (["temizle", "clear"].includes(args[0])) {
            global.rankdb.set("ranks", []);
            message.channel.send({ embeds: [embed.setDescription("Tüm yetkiler başarıyla temizlendi!")] });
        } else if (["liste", "list"].includes(args[0]))
            if (coinDatas.advancedRanks) {
                message.channel.send({ embeds: [embed.setDescription(coinDatas.advancedRanks.map((x) => `${Array.isArray(x.role) ? x.role.map(x => `<@&${x}>`).join(", ") : `<@&${x.role}>`}: ${x.coin}`).join("\n"))] });
            } else {
                message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Datamda ayarlanmış rol bulamadım!`)] }).sil(40)
            }
    }
}

module.exports = SetRank