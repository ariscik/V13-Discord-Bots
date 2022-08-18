class URL extends Command {
    constructor(client) {
        super(client, {
            name: "url",
            aliases: ["kullanım", "URL"],
            Founder: true
        });
    }
    async run(client, message, args, embed) {
        message.guild.fetchVanityData().then(res => {
            message.reply({ embeds: [embed.setAuthor(`${message.guild.name}`).setDescription(`Sunucu özel daveti: **${res.code}** Kullanımı : **${res.uses}**`).setTitle(`Sunucumuzun Özel URL İstatistikleri;`)] })
        })
    }
}

module.exports = URL