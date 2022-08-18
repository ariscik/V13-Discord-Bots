const { ariscik, channelBackup } = require('../../../../Helpers/Schemas')
class KanalKur extends Command {
  constructor(client) {
    super(client, {
      name: "kanalkur",
      aliases: ["channel", "kanal"],
      Founder: true
    });
  }
  async run(client, message, args, embed) {
    const aris = await ariscik.findOne({ guildID: message.guild.id })
    if (!args[0] || isNaN(args[0])) return message.channel.send({ embeds: [embed.setDescription("**UYARI :** Lütfen bir kanal/kategori ID'si belirtiniz!")] });
    channelBackup.findOne({ channelID: args[0] }, async (err, data) => {
      if (!data) return message.channel.send({ embeds: [embed.setDescription("Belirtilen kanal/kategori ID'sine ait veri bulunamadı!")] });
      const newChannel = await message.guild.channels.create(data.name, {
        type: data.type,
        position: data.position + 1,
        nsfw: data.nsfw,
        parentID: data.parentID,
        rateLimit: data.rateLimit,
      });
      await message.channel.send({ embeds: [embed.setDescription(`**${newChannel.name}** isimli kategori/kanal yedeği kuruluyor...`)] })
      if (newChannel.type == 'GUILD_CATEGORY') {
        const textChannels = await channelBackup.find({ parentID: args[0] });
        await channelBackup.updateMany({ parentID: args[0] }, { parentID: newChannel.id });
        textChannels.forEach(c => {
          const textChannel = message.guild.channels.cache.get(c.channelID);
          if (textChannel) textChannel.setParent(newChannel, { lockPermissions: false });
        });
        const voiceChannels = await channelBackup.find({ parentID: args[0] });
        await channelBackup.updateMany({ parentID: args[0] }, { parentID: newChannel.id });
        voiceChannels.forEach(c => {
          const voiceChannel = message.guild.channels.cache.get(c.channelID);
          if (voiceChannel) voiceChannel.setParent(newChannel, { lockPermissions: false });
        });
        const newOverwrite = [];
        for (let index = 0; index < data.overwrites.length; index++) {
          const veri = data.overwrites[index];
          newOverwrite.push({
            id: veri.id,
            allow: new Discord.Permissions(veri.allow).toArray(),
            deny: new Discord.Permissions(veri.deny).toArray()
          });
        }
        await newChannel.permissionOverwrites.set(newOverwrite);
        data.channelID = newChannel.id
        data.save()
      } else if (newChannel.type == 'GUILD_TEXT') {
        const newOverwrite = [];
        for (let index = 0; index < data.overwrites.length; index++) {
          const veri = data.overwrites[index];
          newOverwrite.push({
            id: veri.id,
            allow: new Discord.Permissions(veri.allow).toArray(),
            deny: new Discord.Permissions(veri.deny).toArray()
          });
        }
        if (newChannel) newChannel.setParent(data.parentID, { lockPermissions: false });
        await newChannel.permissionOverwrites.set(newOverwrite);
        data.channelID = newChannel.id
        data.save()
      } else if (newChannel.type == 'GUILD_VOICE') {
        const newOverwrite = [];
        for (let index = 0; index < data.overwrites.length; index++) {
          const veri = data.overwrites[index];
          newOverwrite.push({
            id: veri.id,
            allow: new Discord.Permissions(veri.allow).toArray(),
            deny: new Discord.Permissions(veri.deny).toArray()
          });
        }
        if (newChannel) newChannel.setParent(data.parentID, { lockPermissions: false });
        await newChannel.permissionOverwrites.set(newOverwrite);
        data.channelID = newChannel.id
        data.save()
      }
      if (args[0] === aris.banLog) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { banLog: newChannel.id } }, { upsert: true }).exec(); }

      if (args[0] === aris.jailLog) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { jailLog: newChannel.id } }, { upsert: true }).exec(); }

      if (args[0] === aris.muteLog) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { muteLog: newChannel.id } }, { upsert: true }).exec(); }

      if (args[0] === aris.tagLog) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { tagLog: newChannel.id } }, { upsert: true }).exec(); }

      if (args[0] === aris.denetimLog) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { denetimLog: newChannel.id } }, { upsert: true }).exec(); }

      if (args[0] === aris.messageLog) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { messageLog: newChannel.id } }, { upsert: true }).exec(); }

      if (args[0] === aris.voiceLog) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { voiceLog: newChannel.id } }, { upsert: true }).exec(); }

      if (args[0] === aris.botVoiceChannel) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { botVoiceChannel: newChannel.id } }, { upsert: true }).exec(); }

      if (args[0] === aris.genelChat) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { genelChat: newChannel.id } }, { upsert: true }).exec(); }

      if (args[0] === aris.welcomeChannel) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { welcomeChannel: newChannel.id } }, { upsert: true }).exec(); }

      if (args[0] === aris.inviteLog) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { inviteLog: newChannel.id } }, { upsert: true }).exec(); }

      if (args[0] === aris.guardLog) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { guardLog: newChannel.id } }, { upsert: true }).exec(); }

      if (aris.commandsChannel.includes(args[0])) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $pull: { commandsChannel: channel.id } }, { upsert: true }).exec(); await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $push: { commandsChannel: newChannel.id } }, { upsert: true }).exec(); }

    });
  }
}

module.exports = KanalKur