const { ariscik, roleBackup } = require("../../../../Helpers/Schemas")
const { Database } = require("ark.db")
const emojiDB = new Database("../../../../Settings/emojis.json")
class Kurulum extends Command {
    constructor(client) {
        super(client, {
            name: "kur",
            aliases: ["kurulum", "kurulum"],
            Founder: true,
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        const secim = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu().setPlaceholder('Kuruluma Başla!').setCustomId('kurulumselect').addOptions([{ label: "Emoji Kur!", description: "Gerekli olan tüm emojisi kur!", value: "emojikur" }, { label: "EC Rol Alma Kur!", description: "Etkinlik - Çekiliş Katılımcısı rol alma kur!", value: "ecrolalmakur" }, { label: "Kullanıcı Panel Kur!", description: "Kullanıcı Panel sistemi kur!", value: "kullanicipanel" }, { label: "Log Kanalları Kur!", description: "Log Kanalları kurulumu yap!", value: "logkanalkur" }, { label: "Level Sistemi!", description: "Level Sistemi Kur!", value: "levelsistemi" }, { label: "Kapat!", description: "Menüyü kapatmak için tıkla!", value: "menukapat" }]));
        let kurulum = await message.channel.send({ components: [secim], embeds: [embed.setDescription(`Merhaba! **${message.author}** **${message.guild.name}** Sunucusu kurulum ekranına hoş geldin! \n\n:white_small_square: Aşağıdaki menüden kurmak istediğin kısmı seç ve gerisini bana bırak!`)] })
        kurulum.awaitMessageComponent({ filter: (component) => component.user.id === message.author.id, componentType: 'SELECT_MENU', }).then(async (interaction) => {
            if (interaction.values[0] == "emojikur") {
                if (kurulum) kurulum.delete();
                interaction.channel.send(`Merhaba! Emoji kurulumları başladı! Lütfen biraz bekle!`).sil(10)
                const emojis = [
                    { name: "iptal", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439875170500629/red.gif" },
                    { name: "onay", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439878664486913/green.gif" },
                    { name: "cmute", url: "https://cdn.discordapp.com/attachments/891417899405811723/892115782086053928/890622225953198142.png" },
                    { name: "vmute", url: "https://cdn.discordapp.com/attachments/891417899405811723/892115721163792404/884838767435849758.png" },
                    { name: "hata", url: "https://cdn.discordapp.com/attachments/891417899405811723/892116604106719262/755165371182481479.gif" },
                    { name: "jail", url: "https://cdn.discordapp.com/attachments/891417899405811723/892117548261318696/863176440475287632.png" },
                    { name: "star", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439871505072178/star.gif" },
                    { name: "nokta", url: "https://cdn.discordapp.com/attachments/891417899405811723/892119430207782912/870276411288612894.png" },
                    { name: "ban", url: "https://cdn.discordapp.com/attachments/891417899405811723/892117685440241734/860835060840136734.png" },
                    { name: "fill", url: "https://cdn.discordapp.com/emojis/836740227421700103.gif?v=1" },
                    { name: "empty", url: "https://cdn.discordapp.com/emojis/836740057582534686.png?v=1" },
                    { name: "fillStart", url: "https://cdn.discordapp.com/emojis/836740289841463336.gif?v=1" },
                    { name: "emptyEnd", url: "https://cdn.discordapp.com/emojis/836740118092972062.png?v=1" },
                ]
                emojis.forEach(async (x) => {
                    if (message.guild.emojis.cache.find((e) => x.name === e.name)) return emojiDB.set(x.name, message.guild.emojis.cache.find((e) => x.name === e.name).toString());
                    const emoji = await message.guild.emojis.create(x.url, x.name);
                    await emojiDB.set(x.name, emoji.toString());
                    message.channel.send(`\`${x.name}\` isimli emoji oluşturuldu! (${emoji.toString()})`);
                })
            }
            if (interaction.values[0] == "ecrolalmakur") {
                if (!aris.cekilisRole || !aris.etkinlikRole || !aris.ecChannel) return interaction.channel.send(`**UYARI :** Verilerimde \`Çekiliş Katılımcısı veya Etkinlik katılımcısı veya Rol Alma kanalını bulamadım. Kontrol edip tekrar deneyiniz!\` `).sil(5)
                if (kurulum) kurulum.delete();
                interaction.channel.send(`Merhaba! Etkinlik - Çekiliş katılımcısı rol alma kurulumu tamamlandı!`).sil(10)
                const ecrolalmas = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId('etkinlikrol').setLabel("Etkinlik Katılımcısı").setEmoji("904403680449667122").setStyle('PRIMARY'), new Discord.MessageButton().setCustomId('cekilisrol').setLabel("Çekiliş Katılımcısı").setEmoji("740684333370703923").setStyle('DANGER'));
                let context = `${emojis.star} Hepinize merhabalar ${message.guild.name}! Sunucuya girdiğinizden itibaren <@&${aris.etkinlikRole}> & <@&${aris.cekilisRole}> rolleri üzerinize verildi! Bu rolleri kaldırmak için uygun butonlara tıklamanız yeterli olacaktır!\n\n**🎉 Etkinlik Katılımcısı =** \`Sunucu içerisi olan Konser, Oyun vb. etkinliklerden bildirim almak için gerekli rol!\`\n\n**🎁 Çekiliş Katılımcısı =** \`Sunucu içerisi olan Nitro, Spotify, Exen vb. çekilişlerden bildirim almak için gerekli rol!\`\n\n\`\`\`Unutmayın! Kayıtlı kayıtsız herkes bu kanalı görebilmekte! @everyone && @here gibi bildirimleri kullanmıyoruz! Eğer bu çekiliş ve etkinliklerden haberdar olmak istiyorsanız aşağıdaki butonlardan rollerinizi alabilir, bildirim almak istemiyorsanız butonlara tıklayarak bırakabilirsiniz!\`\`\``
                if (aris.ecChannel) client.channels.cache.get(aris.ecChannel).send({ content: `${context}`, components: [ecrolalmas] })
            }
            if (interaction.values[0] == "kullanicipanel") {
                if (!aris.kullaniciPanelChannel) return interaction.channel.send(`**UYARI :** Verilerimde Kullanıcı Panel sistemi için kanalı bulamadım! Lütfen kontrol edip tekrar deneyiniz!`)
                if (kurulum) kurulum.delete();
                interaction.channel.send(`Merhaba! Kullanıcı Panel sistemi kurulumu tamamlandı!`).sil(10)
                const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId('katilma').setLabel("I").setStyle('DANGER'), new Discord.MessageButton().setCustomId('isim').setLabel("II").setStyle('DANGER'), new Discord.MessageButton().setCustomId('ceza').setLabel("III").setStyle('DANGER'),);
                const row1 = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId('davet').setLabel("IV").setStyle('DANGER'), new Discord.MessageButton().setCustomId('roller').setLabel("V").setStyle('DANGER'), new Discord.MessageButton().setCustomId('tarih').setLabel("VI").setStyle('DANGER'),);
                const row2 = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId('kayitsiz').setLabel("VII").setStyle('DANGER'), new Discord.MessageButton().setCustomId('mesaj').setLabel("VIII").setStyle('DANGER'), new Discord.MessageButton().setCustomId('sescik').setLabel("IX").setStyle('DANGER'),);
                let content = `Merhaba **${message.guild.name}**! Aşağıdan sunucu içerisi yapmak istediğiniz işlem veya ulaşmak istediğiniz bilgi için gerekli butonlara tıklamanız yeterli olacaktır!\n\n**I :** \`Sunucuya katılma tarihinizi gösterir.\`\n**II :** \`İsim geçmişinizi gösterir.\`\n**III :** \`Ceza puanınızı gösterir.\`\n\n**IV :** \`Davet bilgilerinizi gösterir.\`\n**V :** \`Sahip olduğunuz rolleri gösterir.\`\n**VI :** \`Hesabınızın oluşturulma tarihini gösterir.\`\n\n**VII :** \`Kayıtsıza atılın ve yeniden kayıt olun.\`\n**VIII :** \`Mesaj istatistiklerinizi gösterir.\`\n**IX :** \`Ses istatistiklerinizi gösterir.\``
                if (aris.kullaniciPanelChannel) client.channels.cache.get(aris.kullaniciPanelChannel).send({ content: `${content}`, components: [row, row1, row2] })
            }
            if (interaction.values[0] == "logkanalkur") {
                if (kurulum) kurulum.delete();
                interaction.channel.send(`Merhaba! Log Kanalları kurulumu başladı! Lütfen biraz bekleyin!`).sil(10)
                const everyone = message.guild.roles.cache.find(a => a.name === "@everyone");
                const logCategory = await message.guild.channels.create(`${message.guild.name} LOGS`, { type: 'GUILD_CATEGORY', });
                await logCategory.permissionOverwrites.edit(everyone.id, { VIEW_CHANNEL: false });
                const tagLog = await message.guild.channels.create(`・tag・log`, { type: 'GUILD_TEXT', }).then(async channel => await channel.setParent(logCategory, { lockPermissions: true }));
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { tagLog: tagLog.id } }, { upsert: true })
                const messageLog = await message.guild.channels.create(`・message・log`, { type: 'GUILD_TEXT', }).then(async channel => await channel.setParent(logCategory, { lockPermissions: true }));
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { messageLog: messageLog.id } }, { upsert: true })
                const voiceLog = await message.guild.channels.create(`・voice・log`, { type: 'GUILD_TEXT', }).then(async channel => await channel.setParent(logCategory, { lockPermissions: true }));
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { voiceLog: voiceLog.id } }, { upsert: true })
                const yasakTagLog = await message.guild.channels.create(`・yasak・tag・log`, { type: 'GUILD_TEXT', }).then(async channel => await channel.setParent(logCategory, { lockPermissions: true }));
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { yasakTagLog: yasakTagLog.id } }, { upsert: true })
                const denetimLog = await message.guild.channels.create(`・denetim・log`, { type: 'GUILD_TEXT', }).then(async channel => await channel.setParent(logCategory, { lockPermissions: true }));
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { denetimLog: denetimLog.id } }, { upsert: true })
                const commandLog = await message.guild.channels.create(`・command・log`, { type: 'GUILD_TEXT', }).then(async channel => await channel.setParent(logCategory, { lockPermissions: true }));
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { commandLog: commandLog.id } }, { upsert: true })
                const banLog = await message.guild.channels.create(`・ban・log`, { type: 'GUILD_TEXT', }).then(async channel => await channel.setParent(logCategory, { lockPermissions: true }));
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { banLog: banLog.id } }, { upsert: true })
                const muteLog = await message.guild.channels.create(`・mute・log`, { type: 'GUILD_TEXT', }).then(async channel => await channel.setParent(logCategory, { lockPermissions: true }));
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { muteLog: muteLog.id } }, { upsert: true })
                const jailLog = await message.guild.channels.create(`・jail・log`, { type: 'GUILD_TEXT', }).then(async channel => await channel.setParent(logCategory, { lockPermissions: true }));
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { jailLog: jailLog.id } }, { upsert: true })
                const guardLog = await message.guild.channels.create(`・guard・log`, { type: 'GUILD_TEXT', }).then(async channel => await channel.setParent(logCategory, { lockPermissions: true }));
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { guardLog: guardLog.id } }, { upsert: true })
                const missionLog = await message.guild.channels.create(`・mission・log`, { type: 'GUILD_TEXT', }).then(async channel => await channel.setParent(logCategory, { lockPermissions: true }));
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { dailyMissionLog: missionLog.id } }, { upsert: true })
                const rolLog = await message.guild.channels.create(`・rol・log`, { type: 'GUILD_TEXT', }).then(async channel => await channel.setParent(logCategory, { lockPermissions: true }));
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { rolLog: rolLog.id } }, { upsert: true })

            }
            if (interaction.values[0] == "levelsistemi") {
                const { Permissions } = require('discord.js');
                let info = message.guild.channels.cache.filter(x => x.name.toLocaleLowerCase().includes('info') || x.name.toLocaleLowerCase().includes("bilgi") || x.name.toLocaleLowerCase().includes("INFO") || x.name.toLocaleLowerCase().includes("ınfo")).map(x => x.id)[0] || undefined
                if (!info || info == undefined) {
                    message.channel.send({ content: `${emojis.iptal} **Information** kategorisini bulamadım! Bu yüzden kanalı açamadım! Lütfen kontrol ediniz ve \`Aris Lesnar\` ile iletişime geçiniz!` })
                    if (kurulum) kurulum.delete();
                    message.react(emojis.iptal)
                }
                message.react(emojis.onay)
                message.channel.send({ content: `Merhaba ${message.author}! Level rolleri ve kanalı kuruluyor. Sistem otomatik olarak aktif edilecektir!` }).sil(50)
                if (kurulum) kurulum.delete();
                const celmas = await message.guild.roles.create({ name: "🏆 Chat Elmas", reason: "Reward Sistem için Kurulum", color: "6a7e96", permissions: Permissions.FLAGS.READ_MESSAGE_HISTORY, })
                const caltin = await message.guild.roles.create({ name: "🥇 Chat Altın", reason: "Reward Sistem için Kurulum", color: "ffd700", permissions: Permissions.FLAGS.READ_MESSAGE_HISTORY, })
                const cgumus = await message.guild.roles.create({ name: "🥈 Chat Gümüş", reason: "Reward Sistem için Kurulum", color: "c0c0c0", permissions: Permissions.FLAGS.READ_MESSAGE_HISTORY, })
                const cbronz = await message.guild.roles.create({ name: "🥉 Chat Bronz", reason: "Reward Sistem için Kurulum", color: "cd7f32", permissions: Permissions.FLAGS.READ_MESSAGE_HISTORY, })
                const ayirma = await message.guild.roles.create({ name: "_______________", reason: "Reward Sistem için Kurulum" })
                const velmas = await message.guild.roles.create({ name: "🏆 Voice Elmas", reason: "Reward Sistem için Kurulum", color: "6a7e96", permissions: Permissions.FLAGS.READ_MESSAGE_HISTORY, })
                const valtin = await message.guild.roles.create({ name: "🥇 Voice Altın", reason: "Reward Sistem için Kurulum", color: "ffd700", permissions: Permissions.FLAGS.READ_MESSAGE_HISTORY, })
                const vgumus = await message.guild.roles.create({ name: "🥈 Voice Gümüş", reason: "Reward Sistem için Kurulum", color: "c0c0c0", permissions: Permissions.FLAGS.READ_MESSAGE_HISTORY, })
                const vbronz = await message.guild.roles.create({ name: "🥉 Voice Bronz", reason: "Reward Sistem için Kurulum", color: "cd7f32", permissions: Permissions.FLAGS.READ_MESSAGE_HISTORY, })

                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { cBronz: cbronz.id } }, { upsert: true }).exec();
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { cGumus: cgumus.id } }, { upsert: true }).exec();
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { cAltin: caltin.id } }, { upsert: true }).exec();
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { cElmas: celmas.id } }, { upsert: true }).exec();

                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { vBronz: vbronz.id } }, { upsert: true }).exec();
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { vGumus: vgumus.id } }, { upsert: true }).exec();
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { vAltin: valtin.id } }, { upsert: true }).exec();
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { vElmas: velmas.id } }, { upsert: true }).exec();

                const levelLog = await message.guild.channels.create(`level-bilgi`, { type: 'GUILD_TEXT', }).then(async channel => await channel.setParent(info, { lockPermissions: true }));
                await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { levelLog: levelLog.id } }, { upsert: true })
            }
        })
    }
};

module.exports = Kurulum