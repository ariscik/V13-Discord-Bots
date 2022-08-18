const { ariscik, RoleData } = require('../../../../Helpers/Schemas')
class RolLog extends Command {
    constructor(client) {
        super(client, {
            name: "rollog",
            aliases: ["rl","rlg"],
            cooldown: 10
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!aris.commandsChannel.some(kanal => message.channel.id.includes(kanal))) return message.reply(`**UYARI:** Bu komutu yalnızca <#${aris.commandsChannel[0]}> kanalında kullanabilirsin!`).sil(10)
        if (!config.Founders.includes(message.author.id) && !config.root.includes(message.author.id) && !aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)] }).sil(15)
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        var sayi = 1
        var currentPage = 1
        if (!member) {
            message.react(emojis.iptal)
            message.reply("**UYARI :** Bir üye belirtmeyi unuttun!").sil(10)
            return
        }
        RoleData.findOne({ user: member.id }, async (err, res) => {
            if (!res) {
                message.reply(`${member} kişisinin rol bilgisi veritabanında bulunmadı.`).sil(10)
                message.react(emojis.iptal)
                return
            }
            let rol = res.rollers.sort((a, b) => b.tarih - a.tarih)
            rol.map(x => ` \`[${x.tarih}, ${x.state}]\` <@${x.mod}> : <@&${x.rol}>[<@${x.user}>] `)
            let pages = rol.chunk(5);
            if (pages.length === 1) {
                await message.channel.send({ embeds: [embed.setDescription(`${member} adlı üyenin rol ekleme-çıkarma bilgileri aşağıda görüntülenmiştir.\n\n${pages[currentPage - 1].map(x => `\`[${x.tarih}, ${x.state}]\` <@${x.mod}> : <@&${x.rol}>[<@${x.user}>]`).join("\n")}`).setAuthor(member.user.username, member.user.avatarURL({ dynamic: true }))] })
            } else {
                const row = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId('rgeri')
                            .setLabel("◀")
                            .setStyle('PRIMARY'),
                        new Discord.MessageButton()
                            .setCustomId('rollogiptal')
                            .setLabel("❌")
                            .setStyle('DANGER'),
                        new Discord.MessageButton()
                            .setCustomId('rileri')
                            .setLabel("▶")
                            .setStyle('PRIMARY'),
                    );
                let msg = await message.channel.send({ components: [row], embeds: [embed.setDescription(`${member} adlı üyenin rol ekleme-çıkarma bilgileri aşağıda görüntülenmiştir.\n\n${pages[currentPage - 1].map(x => `\`[${x.tarih}, ${x.state}]\` <@${x.mod}> : <@&${x.rol}>[<@${x.user}>]`).join("\n")}`).setFooter(`Sayfa: ${currentPage}`).setAuthor(member.user.username, member.user.avatarURL({ dynamic: true }))] })
                var filter = (button) => button.user.id === message.author.id;
                const collector = msg.createMessageComponentCollector({ filter, time: 30000 })
                collector.on('collect', async (button, user) => {
                    if (button.customId === "rileri") {
                        await button.deferUpdate();
                        if (currentPage == pages.length) return;
                        currentPage++;
                        if (msg) msg.edit({ embeds: [embed.setDescription(`${pages[currentPage - 1].map(x => `\`[${x.tarih}, ${x.state}]\` <@${x.mod}> : <@&${x.rol}>[<@${x.user}>]`).join("\n")}`).setThumbnail(member.user.avatarURL({ dynamic: true })).setFooter(`Sayfa: ${currentPage}`)] });

                    } else if (button.customId === "rollogiptal") {
                        await button.deferUpdate();
                        if (msg) msg.delete().catch(err => { });
                        if (message) return message.delete().catch(err => { });

                    } else if (button.customId === "rgeri") {
                        await button.deferUpdate()
                        if (currentPage == 1) return;
                        currentPage--;
                        if (msg) msg.edit({ embeds: [embed.setDescription(`${pages[currentPage - 1].map(x => `\`[${x.tarih}, ${x.state}]\` <@${x.mod}> : <@&${x.rol}>[<@${x.user}>]`).join("\n")}`).setThumbnail(member.user.avatarURL({ dynamic: true })).setFooter(`Sayfa: ${currentPage}`)] });
                    }
                });
            }
        })
    }
}

module.exports = RolLog