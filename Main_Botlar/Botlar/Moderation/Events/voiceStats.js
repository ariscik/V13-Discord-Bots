const { voiceJoinedAt, voiceUser, voiceGuild, voiceGuildChannel, voiceUserChannel, voiceUserParent, ariscik, coin } = require("../../../Helpers/Schemas")
class VoiceStats {
  Event = "voiceStateUpdate"
  async run(oldState, newState) {
    try {
        if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;

        if (!oldState.channelId && newState.channelId) await voiceJoinedAt.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
    
        let joinedAtData = await voiceJoinedAt.findOne({ userID: oldState.id });
    
        if (!joinedAtData) await voiceJoinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
        joinedAtData = await voiceJoinedAt.findOne({ userID: oldState.id });
        const data = Date.now() - joinedAtData.date;
    
        if (oldState.channelId && !newState.channelId) {
            await saveStats(oldState, oldState.channel, data);
            await voiceJoinedAt.deleteOne({ userID: oldState.id });
        } else if (oldState.channelId && newState.channelId) {
            await saveStats(oldState, oldState.channel, data);
            await voiceJoinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
        }
        if (oldState.channelId && !newState.channelId) {
            await saveData(oldState, oldState.channel, data);
            await voiceJoinedAt.deleteOne({ userID: oldState.id });
        } else if (oldState.channelId && newState.channelId) {
            await saveData(oldState, oldState.channel, data);
            await voiceJoinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
        }
    } catch (e) {
        client.logger.error(`Etkinlik: ${module.exports.name} \nHata: ` + e)
    }
  }
}

module.exports = VoiceStats

async function saveStats(user, channel, data) { await voiceUser.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data } }, { upsert: true }); await voiceGuild.findOneAndUpdate({ guildID: user.guild.id }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data } }, { upsert: true }); await voiceGuildChannel.findOneAndUpdate({ guildID: user.guild.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true }); await voiceUserChannel.findOneAndUpdate({ guildID: user.guild.id, userID: user.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true }); }

async function saveData(user, channel, data) {
    const aris = await ariscik.findOne({ guildID: config.guildID })
    const coindatas = await coin.findOne({ guildID: config.guildID })
    if (aris.coinSystem === true && user.member.roles.cache.has(aris.registerHammer)) {
        if (channel.parent && aris.publicParents.includes(channel.parentID)) await coin.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { coin: ((data / 1000 / 60) /config.voiceCount) *config.publicCoin } }, { upsert: true });
        else await coin.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { coin: ((data / 1000 / 60) /config.voiceCount) *config.voiceCoin } }, { upsert: true });
        const coinData = await coin.findOne({ guildID: user.guild.id, userID: user.id });
        if (coinData && coindatas.advancedRanks.some(x => x.coin >= coinData.coin)) {
            let newRank = coindatas.advancedRanks.filter(x => coinData.coin >= x.coin);
            newRank = newRank[newRank.length - 1];
            if (newRank && Array.isArray(newRank.role) && !newRank.role.some(x => user.member.roles.cache.has(x)) || newRank && !Array.isArray(newRank.role) && !user.member.roles.cache.has(newRank.role)) {
                const oldRank = coindatas.advancedRanks[aris.advancedRanks.indexOf(newRank) - 1];
                user.member.roles.add(newRank.role);
                if (oldRank && Array.isArray(oldRank.role) && oldRank.role.some(x => user.member.roles.cache.has(x)) || oldRank && !Array.isArray(oldRank.role) && user.member.roles.cache.has(oldRank.role)) user.member.roles.remove(oldRank.role);
                const embed = new MessageEmbed().setColor("GREEN");
                user.guild.channels.cache.get(aris.rankLog).send({ embeds: [embed.setDescription(`${user.member.toString()} üyesi **${coinData.coin}** coin hedefine ulaştı ve ${Array.isArray(newRank.role) ? newRank.role.map(x => `<@&${x}>`).join(", ") : `<@&${newRank.role}>`} rolü verildi!`)] });
            }
        }
    }
    user.member.updateTask(user.guild.id, "ses", data, channel);
    if (aris.dolarSystem === true) {
        if (channel.parent && aris.publicParents.includes(channel.parentID)) {
            if (data >= (1000 * 60) *config.voiceCount) await coin.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { dolar:config.voiceDolar * parseInt(data / 1000 / 60) } }, { upsert: true });
        } else if (data >= (1000 * 60) *config.voiceCount) await coin.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { dolar:config.voiceDolar * parseInt(data / 1000 / 60) } }, { upsert: true });
    }
}