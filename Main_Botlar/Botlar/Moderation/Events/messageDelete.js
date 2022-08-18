const Discord = require("discord.js");
const { ariscik, Snipes } = require("../../../Helpers/Schemas")
class MessageDelete {
  Event = "messageDelete"
  async run(message) {
    const aris = await ariscik.findOne({ guildID: config.guildID })
    const channel = client.channels.cache.get(aris.messageLog)
    if (!channel) return;
    if(message.author.bot) return;
    await Snipes.findOneAndUpdate({ guildID: message.guild.id, channelID: message.channel.id }, { $set: { messageContent: message.content, userID: message.author.id, image: message.attachments.first() ? message.attachments.first().proxyURL : null, createdDate: message.createdTimestamp, deletedDate: Date.now() } }, { upsert: true });
    const embedss = new Discord.MessageEmbed()
    .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
    .setColor("RANDOM")
    .setTitle(`${message.channel.name} adlı kanalda bir mesaj silindi!`)
    .setDescription(message.content)
    .setFooter(`ID: ${message.author.id} • Kullanıcı : ${message.member.displayName}`)
    .setTimestamp()
    if (message.attachments.first()) embedss.setImage(message.attachments.first().proxyURL);
    channel.send({embeds: [embedss]})  }
}

module.exports = MessageDelete