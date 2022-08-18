const { ariscik, coin } = require('../../../../Helpers/Schemas')
class SenkronRank extends Command {
    constructor(client) {
        super(client, {
            name: "senkron",
            aliases: ["senkronize"],
            Founder: true
        });
    }
    async run(client, message, args, embed) {
        const coinDatas = await coin.findOne({ guildID: message.guild.id })
        if (args[0] === "kişi" || args[0] === "user") {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            if (!member) return message.reply({ embeds: [embed.setDescription("Bir kullanıcı belirtmelisin!")] }).sil(20)

            if (coinDatas.advancedRanks.map(x => member.hasRole(x.role))) {
                let rank = coinDatas.advancedRanks.filter(x => member.hasRole(x.role));
                rank = rank[rank.length - 1];
                await coin.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $set: { coin: rank.coin } }, { upsert: true });
                message.reply({ embeds: [embed.setDescription(`${member.toString()} üyesinde ${Array.isArray(rank.role) ? rank.role.map(x => `<@&${x}>`).join(", ") : `<@&${rank.role}>`} rolü bulundu ve coini ${rank.coin} olarak değiştirildi!`)] });
            } else return message.reply({ embeds: [embed.setDescription(`${member.toString()} üyesinde sistemde ayarlı bir rol bulunamadı!`)] });
        } else if (args[0] === "role" || args[0] === "rol") {
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (!role) return message.reply({ embeds: [embed.setDescription("Bir rol belirtmelisin!")] });
            if (role.members.length === 0) return message.reply({ embeds: [embed.setDescription("Bu rolde üye bulunmuyor!")] });
            role.members.forEach(async member => {
                if (member.user.bot) return;
                if (coinDatas.advancedRanks.map(x => member.hasRole(x.role))) {
                    let rank = coinDatas.advancedRanks.filter(x => member.hasRole(x.role));
                    rank = rank[rank.length - 1];
                    await coin.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $set: { coin: rank.coin } }, { upsert: true });
                    message.reply({ embeds: [embed.setDescription(`${member.toString()} üyesinde ${Array.isArray(rank.role) ? rank.role.map(x => `<@&${x}>`).join(", ") : `<@&${rank.role}>`} rolü bulundu ve coini ${rank.coin} olarak değiştirildi!`)] });
                } else return message.reply({ embeds: [embed.setDescription(`${member.toString()} üyesinde sistemde ayarlı bir rol bulunamadı!`)] });
            });
        } else return message.reply({ embeds: [embed.setDescription("Bir argüman belirtmelisin! \`kişi - rol\`")] });
    }
}

module.exports = SenkronRank