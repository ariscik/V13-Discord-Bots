const { ariscik, tasks } = require("../../../../Helpers/Schemas")
const moment = require("moment")
moment.locale("tr")
class Tasks extends Command {
    constructor(client) {
        super(client, {
            name: "task",
            aliases: ["görev", "tasks", "görevver"],
            Founder: true,
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: config.guildID });
        const type = args[2];
        const duration = 1000 * 60 * (["hourly", "saatlik"].includes(args[3]) ? 60 : ["daily", "günlük"].includes(args[3]) ? 60 * 24 : ["weekly", "haftalık"].includes(args[3]) ? 60 * 24 * 7 : args[3]);
        let count = args[4];
        const prizeCount = args[5];
        const channels = [...message.mentions.channels.values()];
        if (!args[0]) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir argüman belirtmelisin! \`ver - sil - dağıt\``)] })
        if (args[0] == 'dağıt' || args[0] == 'dagit' || args[0] == 'dağit') {
            let arr = ["davet", "mesaj", "ses", "taglı", "teyit"];
            let dagit = []
            await client.guilds.cache.get(config.guildID).roles.cache.get(aris.registerHammer).members.array().forEach((x, index) => {
                let random = arr[Math.floor(Math.random() * arr.length)]
                dagit.push({
                    user: x.id,
                    gorev: random
                })
            });

            let veri = dagit;
            client.channels.cache.get(aris.dailyMissionLog).send(`${client.guilds.cache.get(config.guildID).name} ${moment(Date.now()).locale("tr").format("LLL")} tarihinde dağıtılan günlük görevler;`);
            veri.forEach((user, index) => {
                setTimeout(async () => {
                    if (index >= veri.length) return client.channels.cache.get(aris.dailyMissionLog).send(`Başarılı bir şekilde tüm görevlerin dağıtımı tamamlandı!`);
                    let mesajRandom = getRandomInt(300, 400)
                    let davetRandom = getRandomInt(5, 10)
                    let sesRandom = getRandomInt(60, 300)
                    let taglıRandom = getRandomInt(1, 3)
                    let teyitRandom = getRandomInt(5, 20)
                    let miktarlar = user.gorev == "mesaj" ? mesajRandom : user.gorev == "davet" ? davetRandom : user.gorev == "ses" ? sesRandom : user.gorev == "taglı" ? taglıRandom : user.gorev == "teyit" ? teyitRandom : 0
                    if (user.gorev == 'ses') {
                        const id = await tasks.find({ guildID: config.guildID });
                        client.channels.cache.get(aris.dailyMissionLog).send(`<@${user.user}> bugün ses kanallarında \`${miktarlar}\` dakika ses aktifliği görevi aldın!`)
                        await new tasks({ guildID: config.guildID, userID: user.user, id: id ? id.length + 1 : 1, type: "ses", count: miktarlar, prizeCount: 35, active: true, finishDate: moment().endOf('day'), channels: null, message: `Ses kanallarında ${miktarlar} dakika vakit geçir!` }).save();
                    }
                    if (user.gorev == 'mesaj') {
                        const id = await tasks.find({ guildID: config.guildID });
                        client.channels.cache.get(aris.dailyMissionLog).send(`<@${user.user}> bugün <#${aris.genelChat}> kanalında \`${miktarlar}\` mesaj atma görevi aldın!`)
                        await new tasks({ guildID: config.guildID, userID: user.user, id: id ? id.length + 1 : 1, type: "mesaj", count: miktarlar, prizeCount: 35, active: true, finishDate: moment().endOf('day'), channels: aris.genelChat, message: `<#${aris.genelChat}> kanalında ${miktarlar} mesaj at!` }).save();
                    }
                    if (user.gorev == 'taglı') {
                        const id = await tasks.find({ guildID: config.guildID });
                        client.channels.cache.get(aris.dailyMissionLog).send(`<@${user.user}> bugün \`${miktarlar}\` adet taglı üye çekme görevi aldın!`)
                        await new tasks({ guildID: config.guildID, userID: user.user, id: id ? id.length + 1 : 1, type: "taglı", count: miktarlar, prizeCount: 35, active: true, finishDate: moment().endOf('day'), channels: null, message: `${miktarlar} adet taglı üye çek!` }).save();
                    }
                    if (user.gorev == 'teyit') {
                        const id = await tasks.find({ guildID: config.guildID });
                        client.channels.cache.get(aris.dailyMissionLog).send(`<@${user.user}> bugün \`${miktarlar}\` adet kayıt yapma görevi aldın!`)
                        await new tasks({ guildID: config.guildID, userID: user.user, id: id ? id.length + 1 : 1, type: "kayıt", count: miktarlar, prizeCount: 35, active: true, finishDate: moment().endOf('day'), channels: null, message: `${miktarlar} adet kayıt yap!` }).save();
                    }
                    if (user.gorev == 'davet') {
                        const id = await tasks.find({ guildID: config.guildID });
                        client.channels.cache.get(aris.dailyMissionLog).send(`<@${user.user}> bugün \`${miktarlar}\` adet davet görevi aldın!`)
                        await new tasks({ guildID: config.guildID, userID: user.user, id: id ? id.length + 1 : 1, type: "invite", count: miktarlar, prizeCount: 35, active: true, finishDate: moment().endOf('day'), channels: null, message: `${miktarlar} adet invite yap!` }).save();
                    }
                }, index * 2000)
            })
        } else if (args[0] == 'ver' || args[0] == 'yükle' || args[0] == 'ekle') {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            let role = null;
            if (!member && message.mentions.roles.first()) role = message.mentions.roles.first();
            else if (!member) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir üye belirtmeyi unuttun!`)] }).sil(20)
            if (!role && !member.roles.cache.has(aris.registerHammer)) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bu üye bir yetkili değil!`)] }).sil(40);
            if (!type || !["invite", "ses", "mesaj", "taglı", "kayıt"].includes(type)) return message.channel.send({ embeds: [embed.setDescription(`**UYARI: ** Bir görev tipi belirt! \`invite - ses - mesaj - taglı - kayıt\``)] })
            if (type === "ses") count = 1000 * 60 * count;
            if (!args[3]) return message.channel.send({ embeds: [embed.setDescription(`** UYARI**: Bir süre belirtmelisin!`)] }).sil(40)
            if (!count || isNaN(count)) return message.channel.send({ embeds: [embed.setDescription(`Bir miktar belirtmelisin!`)] }).sil(20)
            if (!prizeCount || isNaN(prizeCount)) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir ödül belirlemeyi unuttun!`)] }).sil(40)
            let taskMessage;
            switch (type) {
                case "invite":
                    taskMessage = `**Sunucumuza ${count} kişi davet et!**`;
                    break;
                case "mesaj":
                    taskMessage = channels.length ? `**${channels.map((x) => `<#${x}>`).join(", ")} ${channels.length > 1 ? "kanallarında" : "kanalında"} ${count} mesaj at!**` : `**Metin kanallarında ${count} mesaj at!**`;
                    break;
                case "ses":
                    taskMessage = channels.length ? `**${channels.map((x) => `<#${x}>`).join(", ")} ${channels.length > 1 ? "kanallarında" : "kanalında"} ${count / 1000 / 60} dakika vakit geçir!` : `**Seste ${count / 1000 / 60} dakika vakit geçir!**`;
                    break;
                case "taglı":
                    taskMessage = `**${count} kişiye tag aldır!**`;
                    break;
                case "kayıt":
                    taskMessage = `**Sunucumuzda ${count} kişi kayıt et!**`;
                    break;
            }
            if (role) {
                const members = role.members.filter((x) => x.roles.cache.has(aris.registerHammer));
                if (!members.size) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** ${role.toString()} rolü olan kimse yetkili değil!`)] }).sil(50)
                await members.forEach(async (member) => {
                    const id = await tasks.find({ guildID: message.guild.id });
                    await new tasks({ guildID: message.guild.id, userID: member.user.id, id: id ? id.length + 1 : 1, type: type, count: count, prizeCount: prizeCount, active: true, finishDate: Date.now() + duration, channels: channels.length ? channels.map((x) => x.id) : null, message: taskMessage }).save();
                });
                await message.channel.send({ embeds: [embed.setDescription(`${message.mentions.roles.first().toString()} rolüne sahip olan tüm üyelere başarıyla ${type} görevi verildi! \nGörev verilen üyeler: ${members.map((x) => x.toString()).join(", ")}`)] }).sil(50);
                if (aris.dailyMissionLog) client.channels.cache.get(aris.dailyMissionLog).send(`${members.map((x) => x.toString()).join(", ")} üyelerine ${type} görevi dağıtıldı!`)
            } else {
                const id = await tasks.find({ guildID: message.guild.id });
                await new tasks({ guildID: message.guild.id, userID: member.id, id: id ? id.length + 1 : 1, type: type, count: count, prizeCount: prizeCount, active: true, finishDate: Date.now() + duration, channels: channels.length ? channels.map((x) => x.id) : null, message: taskMessage }).save();
                message.channel.send({ embeds: [embed.setDescription(`${member.toString()} üyesine başarıyla ${type} görevi verildi!`)] }).sil(50)
                if (aris.dailyMissionLog) client.channels.cache.get(aris.dailyMissionLog).send(`${member.toString()} üyesine ${type} görevi verildi!`)
            }

        } else if (args[0] == 'sil' || args[0] == 'temizle') {
            const id = args[1];
            if (!id || isNaN(id)) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir görev id'si belirtmelisin!`)] }).sil(20);
            await tasks.deleteOne({ guildID: message.guild.id, id });
            await message.channel.send({ embeds: [embed.setDescription(`${emojis.onay} ${id} ID'li görev başarılı bir şekilde silindi!`)] });
            await message.react(emojis.onay)

        }
    }
}

module.exports = Tasks

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }