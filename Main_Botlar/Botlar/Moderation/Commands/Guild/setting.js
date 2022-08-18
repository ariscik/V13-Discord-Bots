const { ariscik} = require("../../../../Helpers/Schemas")
class Settings extends Command {
    constructor(client) {
        super(client, {
            name: "ayar",
            aliases: ["ayarlar","ayar","settings"],
            Founder: true,
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId('serverguard').setLabel(`Server Guard : ${aris.serverGuard ? '🟢' : '🔴'}`).setStyle('PRIMARY'), new Discord.MessageButton().setCustomId('channelguard').setLabel(`Channel Guard : ${aris.channelGuard ? '🟢' : '🔴'}`).setStyle('PRIMARY'), new Discord.MessageButton().setCustomId('roleguard').setLabel(`Rol Guard : ${aris.roleGuard ? '🟢' : '🔴'}`).setStyle('PRIMARY'), new Discord.MessageButton().setCustomId('urlguard').setLabel(`URL Guard : ${aris.urlGuard ? '🟢' : '🔴'}`).setStyle('PRIMARY'), new Discord.MessageButton().setCustomId('tacguard').setLabel(`Taç Guard : ${aris.tacGuard ? '🟢' : '🔴'}`).setStyle('PRIMARY'),)
        const row2 = new Discord.MessageActionRow().addComponents( new Discord.MessageButton().setCustomId('taglialim').setLabel(`Tagli Alim : ${aris.tagliAlim ? '🟢' : '🔴'}`).setStyle('PRIMARY'),)
        let settings = await message.channel.send({ embeds: [embed.setDescription(`Merhaba! **${message.author}** Aşağıdaki butonlardan açık/kapatmak istediğiniz ayarları seçebilirsiniz!`)], components: [row, row2] })
        var filter = (button) => button.user.id === message.author.id;
        const collector = settings.createMessageComponentCollector({ filter })
        collector.on('collect', async (button, user) => {
            if (button.customId === "serverguard") {
                if (aris.serverGuard === true) {
                    await ariscik.findOneAndUpdate({ guildID: config.guildID }, { serverGuard: false }, { upsert: true });
                    button.reply(`Tebrikler ${button.user}! Başarıyla \`Sunucu Koruması\` kapatıldı! ${emojis.onay}`)
                } else if (aris.serverGuard === false) {
                    await ariscik.findOneAndUpdate({ guildID: config.guildID }, { serverGuard: true }, { upsert: true });
                    button.reply(`Tebrikler ${button.user}! Başarıyla \`Sunucu Koruması\` açıldı! ${emojis.onay}`)
                }
            }
            if (button.customId === "roleguard") {
                if (aris.roleGuard === true) {
                    await ariscik.findOneAndUpdate({ guildID: config.guildID }, { roleGuard: false }, { upsert: true });
                    button.reply(`Tebrikler ${button.user}! Başarıyla \`Rol Koruması\` kapatıldı! ${emojis.onay}`)
                } else if (aris.roleGuard === false) {
                    await ariscik.findOneAndUpdate({ guildID: config.guildID }, { roleGuard: true }, { upsert: true });
                    button.reply(`Tebrikler ${button.user}! Başarıyla \`Rol Koruması\` açıldı! ${emojis.onay}`)
                }
            }
            if (button.customId === "channelguard") {
                if (aris.channelGuard === true) {
                    await ariscik.findOneAndUpdate({ guildID: config.guildID }, { channelGuard: false }, { upsert: true });
                    button.reply(`Tebrikler ${button.user}! Başarıyla \`Kanal Koruması\` kapatıldı! ${emojis.onay}`)
                } else if (aris.channelGuard === false) {
                    await ariscik.findOneAndUpdate({ guildID: config.guildID }, { channelGuard: true }, { upsert: true });
                    button.reply(`Tebrikler ${button.user}! Başarıyla \`Kanal Koruması\` açıldı! ${emojis.onay}`)
                }
            }
            if (button.customId === "urlguard") {
                if (aris.urlGuard === true) {
                    await ariscik.findOneAndUpdate({ guildID: config.guildID }, { urlGuard: false }, { upsert: true });
                    button.reply(`Tebrikler ${button.user}! Başarıyla \`Url Koruması\` kapatıldı! ${emojis.onay}`)
                } else if (aris.urlGuard === false) {
                    await ariscik.findOneAndUpdate({ guildID: config.guildID }, { urlGuard: true }, { upsert: true });
                    button.reply(`Tebrikler ${button.user}! Başarıyla \`Url Koruması\` açıldı! ${emojis.onay}`)
                }
            }
            if (button.customId === "tacguard") {
                if (aris.tacGuard === true) {
                    await ariscik.findOneAndUpdate({ guildID: config.guildID }, { tacGuard: false }, { upsert: true });
                    button.reply(`Tebrikler ${button.user}! Başarıyla \`Taç Koruması\` kapatıldı! ${emojis.onay}`)
                } else if (aris.tacGuard === false) {
                    await ariscik.findOneAndUpdate({ guildID: config.guildID }, { tacGuard: true }, { upsert: true });
                    button.reply(`Tebrikler ${button.user}! Başarıyla \`Taç Koruması\` açıldı! ${emojis.onay}`)
                }
            }
            if (button.customId === "taglialim") {
                if (aris.tagliAlim === true) {
                    await ariscik.findOneAndUpdate({ guildID: config.guildID }, { tagliAlim: false }, { upsert: true });
                    button.reply(`Tebrikler ${button.user}! Başarıyla \`Taglı Alım\` kapatıldı! ${emojis.onay}`)
                } else if (aris.tagliAlim === false) {
                    await ariscik.findOneAndUpdate({ guildID: config.guildID }, { tagliAlim: true }, { upsert: true });
                    button.reply(`Tebrikler ${button.user}! Başarıyla \`Taglı Alım\` açıldı! ${emojis.onay}`)
                }
            }
        })
    }
};

module.exports = Settings