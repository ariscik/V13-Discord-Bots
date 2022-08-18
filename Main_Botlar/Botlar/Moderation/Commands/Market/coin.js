const { ariscik, coins } = require('../../../../Helpers/Schemas')
class CoinMiktar extends Command {
    constructor(client) {
        super(client, {
            name: "coin",
            aliases: ["bakiye", "para", "param"],
            cooldown: 20
        });
    }
    async run(client, message, args, embed) {
        let kullanici = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first() : message.author) || message.author;
        let Coin = await coins.findOne({ userID: kullanici.id })
        message.channel.send({ embeds: [embed.setDescription(`${kullanici} üyenin güncel hesabında \`${Coin ? Coin.Coin : 0}\` coin bulunmakta.`)] })
    }
}

module.exports = CoinMiktar