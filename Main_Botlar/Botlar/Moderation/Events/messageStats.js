const { messageUser, messageGuild, messageGuildChannel, messageUserChannel, ariscik, coin } = require("../../../Helpers/Schemas")
const nums = new Map();
class MessageStats {
  Event = "messageCreate"
  async run(message) {
    try {
        if (message.author.bot || message.channel.type == "dm" || message.content.startsWith(config.prefix)) return;
        const aris = await ariscik.findOne({ guildID: config.guildID })
        const coindatas = await coin.findOne({ guildID: config.guildID })
        await messageUser.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1 } }, { upsert: true });
        await messageGuild.findOneAndUpdate({ guildID: message.guild.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1 } }, { upsert: true });
        await messageGuildChannel.findOneAndUpdate({ guildID: message.guild.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
        await messageUserChannel.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
        if (aris.dolarSystem === true) {
            if (message.channel.id !== aris.genelChat) return;
            await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { dolar: config.messageCoin } }, { upsert: true });
        }
        if (aris.coinSystem === true && message.member.roles.cache.has(aris.registerHammer)) {
            const num = nums.get(message.author.id);
            if (num && (num % config.messageCount) === 0) {
                nums.set(message.author.id, num + 1);
                await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: config.messageCoin } }, { upsert: true });
                const coinData = await coin.findOne({ guildID: message.guild.id, userID: message.author.id });
                if (coinData && coindatas.advancedRanks.some(x => coinData.coin === x.coin)) {
                    let newRank = coindatas.advancedRanks.filter(x => coinData.coin >= x.coin);
                    newRank = newRank[newRank.length - 1];
                    const oldRank = coindatas.advancedRanks[coindatas.advancedRanks.indexOf(newRank) - 1];
                    message.member.roles.add(newRank.role);
                    if (oldRank && Array.isArray(oldRank.role) && oldRank.role.some(x => message.member.roles.cache.has(x)) || oldRank && !Array.isArray(oldRank.role) && message.member.roles.cache.has(oldRank.role)) message.member.roles.remove(oldRank.role);
                    const embed = new MessageEmbed().setColor("GREEN");
                    message.guild.channels.cache.get(aris.rankLog).send({ embeds: [embed.setDescription(`${message.member.toString()} üyesi **${coinData.coin}** coin hedefine ulaştı ve ${Array.isArray(newRank.role) ? newRank.role.map(x => `<@&${x}>`).join(", ") : `<@&${newRank.role}>`} rolü verildi!`)] });
                }
            } else nums.set(message.author.id, num ? num + 1 : 1);
            if (message.channel.id == aris.genelChat) {
                message.member.updateTask(message.guild.id, "mesaj", 1, message.channel);
            }
        }
    } catch (e) {
        client.logger.error(`Etkinlik: ${module.exports.name} \nHata: ` + e )
    }
}
}

module.exports = MessageStats