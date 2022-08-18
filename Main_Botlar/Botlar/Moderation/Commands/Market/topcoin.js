const { ariscik, coins } = require('../../../../Helpers/Schemas')
class CoinMiktar extends Command {
    constructor(client) {
        super(client, {
            name: "topcoin",
            aliases: ["topc", "zenginler", "toppara"],
            cooldown: 20
        });
    }
    async run(client, message, args, embed) {
        let Zenginler = await coins.find().sort({ Coin: -1 }).limit(20).exec();
        message.channel.send({ embeds: [embed.setDescription(`${Zenginler.filter(x => message.guild.members.cache.get(x.userID)).map((x, index) => `\`${index == 0 ? `👑` : `${index+1}.`}\` ${x.userID ? message.guild.members.cache.get(x.userID) : `<@${x.userID}>`} \`${x.Coin}\` Coin ${x.userID == message.member.id ? `**(Siz)**` : ``}`).join('\n')}`)] })
    
    }
}

module.exports = CoinMiktar