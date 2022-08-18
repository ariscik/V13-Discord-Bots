const Discord = require("discord.js");
const { ariscik, talentPerms } = require("../../../Helpers/Schemas")
class MessageCreate {
  Event = "messageCreate"
  async run(message) {
    const content = message.content.toLocaleLowerCase()
    if (message.author.bot) return
    if (content === "tag" || content === ".tag" || content === "!tag") {
      const aris = await ariscik.findOne({ guildID: config.guildID })
      if (message) message.react(emojis.onay)
      message.channel.send(`${aris.tags.map(t => `${t}`).join(',')}`).sil(500)
    }
    if (!config.prefix.some(x=> message.content.startsWith(x)) || !message.guild || message.channel.type == "dm") return;
    let args = message.content.toLocaleLowerCase().substring(config.prefix.some(x => x.length)).split(" ");
    let komutAd = args[0]
    args = message.content.split(' ').slice(1);
    let cmd;
    if (client.commands.has(komutAd)) {
      cmd = client.commands.get(komutAd);
    } else if (client.aliases.has(komutAd)) {
      cmd = client.commands.get(client.aliases.get(komutAd));
    }
    if (!cmd) return;
    const embed = new Discord.MessageEmbed().setColor("RANDOM").setAuthor(message.author.username, message.author.avatarURL({ dynamic: true })).setTimestamp().setFooter(`Developed By Aris.`, client.user.avatarURL({ dynamic: true }))
    if (config.root.includes(message.author.id)) try {
      cmd.run(client, message, args, embed).catch(error => { if (message) message.react(emojis.iptal); message.channel.send({ content: `Komut çalıştırılırken bir hata ile karşılaşıldı!\nHata: \`` + error + `\`\nHatanın çözümü için \`Aris Lesnar\` ile iletişime geçiniz!` }); })
    } catch (error) {
      if (message) message.react(emojis.iptal)
      message.channel.send({ content: `Komut çalıştırılırken bir hata ile karşılaşıldı!\nHata: \`` + e + `\`\n Hatanın çözümü için \`Aris Lesnar\` ile iletişime geçiniz!` });
    } else if (!cmd.config.enabled) {
      return message.channel.send(`\`${cmd.info.name.charAt(0).replace('i', "İ").toUpperCase() + cmd.info.name.slice(1)}\` isimli komut şuanda devre dışı!`).then(e => setTimeout(() => e.delete(), 7000))
    } else if (cmd.config.Aris) {
      return;
    } else if (cmd.config.Founder && !config.Founders.includes(message.author.id)) {
      return;
    } else if (config.Founders.includes(message.author.id) || config.root.includes(message.author.id)) {
      const aris = await ariscik.findOne({ guildID: config.guildID })
      client.logger.log(`[${message.author.id}] ${message.author.username}, [${cmd.info.name}] isimli komudu çalıştırdı`, "cmd");
      if (aris.commandLog) client.channels.cache.get(aris.commandLog).send(`⚙️ ${message.author.username} (\`${message.author.id}\`) kişisi [${cmd.info.name}] isimli komutu çalıştırdı!`)
      cmd.run(client, message, args, embed).catch(error => { client.logger.error(`Komut: ${cmd.info.name}` + error) })
    } else {
      if (!client.cooldowns.has(cmd.info.name)) {
        client.cooldowns.set(cmd.info.name, new Discord.Collection());
      }
      const timestamp = client.cooldowns.get(cmd.info.name);
      const timeOut = (cmd.info.cooldown || 1) * 1000;
      if (config.cmdLimit > 0 && client.cmdLimit.has(message.author.id) && client.cmdLimit.get(message.author.id) === config.cmdLimit && timestamp.has(message.author.id)) {
        const sonaErme = timestamp.get(message.author.id) + timeOut;
        if (Date.now() < sonaErme) { const timeLeft = (sonaErme - Date.now()) / 1000; return message.channel.send(`${emojis.hata} **UYARI:** \`${cmd.info.name.charAt(0).replace('i', "İ").toUpperCase() + cmd.info.name.slice(1)}\` komutunu tekrardan kullanabilmek için \`${timeLeft.toFixed(1)}\` saniye beklemelisin.`).then(e => setTimeout(() => e.delete(), 7000)); }
      }
      timestamp.set(message.author.id, Date.now());
      if (config.cmdLimit > 0) { if (!client.cmdLimit.has(message.author.id)) client.cmdLimit.set(message.author.id, 1); else { client.cmdLimit.set(message.author.id, client.cmdLimit.get(message.author.id) + 1); }; }
      setTimeout(() => {
        if (client.cmdLimit.has(message.author.id)) client.cmdLimit.delete(message.author.id); timestamp.delete(message.author.id)
      }, timeOut)
      try {
        const aris = await ariscik.findOne({ guildID: config.guildID })
        client.logger.log(`[${message.author.id}] ${message.author.username}, [${cmd.info.name}] isimli komudu çalıştırdı`, "cmd");
        if (aris.commandLog) client.channels.cache.get(aris.commandLog).send(`⚙️ ${message.author.username} (\`${message.author.id}\`) kişisi [${cmd.info.name}] isimli komutu çalıştırdı!`)
        cmd.run(client, message, args, embed).catch(error => { client.logger.error(`Komut: ${cmd.info.name}` + error) })
      } catch (error) {
        client.logger.error(`Komut: ${cmd.info.name}` + error)
      }
    }
  }
}

module.exports = MessageCreate