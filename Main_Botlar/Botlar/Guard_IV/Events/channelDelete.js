const { ariscik, channelBackup } = require("../../../Helpers/Schemas")
const { guvenli } = require("../../../Helpers/function")
class channelDelete {
  Event = "channelDelete"
  async run(channel) {
    const aris = await ariscik.findOne({ guildID: config.guildID })
    if (aris.channelGuard === true) try {
        let entry = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_DELETE' }).then(audit => audit.entries.first());
        if (!entry || Date.now() - entry.createdTimestamp > 5000 || await guvenli(entry.executor.id)) return;
        let newChannel;
        if ((channel.type === 'GUILD_TEXT') || (channel.type === 'GUILD_NEWS')) { newChannel = await channel.guild.channels.create(channel.name, { type: channel.type, topic: channel.topic, nsfw: channel.nsfw, parent: channel.parent, position: channel.position + 1, rateLimitPerUser: channel.rateLimitPerUser }); }
        if (channel.type === 'GUILD_VOICE') { newChannel = await channel.guild.channels.create(channel.name, { type: channel.type, bitrate: channel.bitrate, userLimit: channel.userLimit, parent: channel.parent, position: channel.position + 1 }); }
        if (channel.type === 'GUILD_CATEGORY') { newChannel = await channel.guild.channels.create(channel.name, { type: channel.type, position: channel.position + 1 });
            const textChannels = await channelBackup.find({ parentID: channel.id });
            await channelBackup.updateMany({ parentID: channel.id }, { parentID: newChannel.id });
            textChannels.forEach(c => { const textChannel = channel.guild.channels.cache.get(c.channelID); if (textChannel) textChannel.setParent(newChannel, { lockPermissions: false }); });
            const voiceChannels = await channelBackup.find({ parentID: channel.id });
            await channelBackup.updateMany({ parentID: channel.id }, { parentID: newChannel.id });
            voiceChannels.forEach(c => { const voiceChannel = channel.guild.channels.cache.get(c.channelID); if (voiceChannel) voiceChannel.setParent(newChannel, { lockPermissions: false }); }); };
        channel.permissionOverwrites.cache.forEach(perm => {
            let thisPermOverwrites = {};
            perm.allow.toArray().forEach(p => { thisPermOverwrites[p] = true; });
            perm.deny.toArray().forEach(p => { thisPermOverwrites[p] = false; });
            newChannel.permissionOverwrites.create(perm.id, thisPermOverwrites);
        });

        //DATAYI GUNCELLEME KISMI

    if(channel.id === aris.banLog) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { banLog: newChannel.id } }, { upsert: true }).exec(); }

    if(channel.id === aris.jailLog) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { jailLog: newChannel.id } }, { upsert: true }).exec(); }

    if(channel.id === aris.muteLog) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { muteLog: newChannel.id } }, { upsert: true }).exec(); }

    if(channel.id === aris.tagLog) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { tagLog: newChannel.id } }, { upsert: true }).exec(); }

    if(channel.id === aris.denetimLog) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { denetimLog: newChannel.id } }, { upsert: true }).exec(); }

    if(channel.id === aris.messageLog) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { messageLog: newChannel.id } }, { upsert: true }).exec(); }

    if(channel.id === aris.voiceLog) {  await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { voiceLog: newChannel.id } }, { upsert: true }).exec(); }

    if(channel.id === aris.botVoiceChannel) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { botVoiceChannel: newChannel.id } }, { upsert: true }).exec(); }

    if(channel.id === aris.genelChat) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { genelChat: newChannel.id } }, { upsert: true }).exec(); }

    if(channel.id === aris.welcomeChannel) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { welcomeChannel: newChannel.id } }, { upsert: true }).exec(); }

    if(channel.id === aris.inviteLog) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { inviteLog: newChannel.id } }, { upsert: true }).exec(); }
    
    if(channel.id === aris.guardLog) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { guardLog: newChannel.id } }, { upsert: true }).exec(); }

    if(aris.commandsChannel.includes(channel.id)) {  await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $pull: { commandsChannel: channel.id } }, { upsert: true }).exec(); await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $push: { commandsChannel: newChannel.id } }, { upsert: true }).exec(); }

    } catch (error) { console.log(`Etkinlik : Channel Delete - Hata : ` + error) }
  }
}

module.exports = channelDelete