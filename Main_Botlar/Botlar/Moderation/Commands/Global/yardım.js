const { ariscik, talentPerms } = require('../../../../Helpers/Schemas')
class Yardım extends Command {
    constructor(client) {
        super(client, {
            name: "yardım",
            aliases: ["help"],
            cooldown: 15
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!aris.commandsChannel.some(kanal => message.channel.id.includes(kanal))) return message.reply(`**UYARI:** Bu komutu yalnızca <#${aris.commandsChannel[0]}> kanalında kullanabilirsin!`).sil(10)
        let data = await talentPerms.find({});
        const list = client.commands
			.filter((x) => x.info.name)
			.sort((a, b) => b.info.name - a.info.name)
			.map((x) => `\`.${x.info.name}\``)
			.join("\n");
        message.channel.send({ embeds: [embed.setDescription(`**Tüm Komutlar :**\n\n${list}`).addField(`**Özel Komutlar:**`,`\`${data.map(x => `.` + x.komutAd).join("\n")}\`\n\n\`Özel komut eklemek için : .tp ekle\``)]})
    
    }
}

module.exports = Yardım