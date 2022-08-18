const { ariscik, tasks, messageUser, voiceUser, coin, Users, Inviter, Penalties } = require('../../../../Helpers/Schemas')
const moment = require("moment"); require("moment-duration-format");
class YStat extends Command {
    constructor(client) {
        super(client, {
            name: "ystat",
            aliases: ["yetkim", "görevlerim", "tasks"],
            cooldown: 10
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        const coinDatas = await coin.findOne({ guildID: message.guild.id })
        if (!aris.commandsChannel.some(kanal => message.channel.id.includes(kanal))) return message.reply(`**UYARI:** Bu komutu yalnızca <#${aris.commandsChannel[0]}> kanalında kullanabilirsin!`).sil(10)
        if (!message.member.roles.cache.has(aris.registerHammer) && !aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol))) return message.reply(`**UYARI: **Bu komutu kullanmak için yeterli yetkiye sahip değilsin!`).sil(10);
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const coinData = await coin.findOne({ guildID: message.guild.id, userID: member.user.id });
        const maxValue = coinDatas.advancedRanks[coinDatas.advancedRanks.indexOf(coinDatas.advancedRanks.find(x => x.coin >= (coinData ? Math.floor(coinData.coin) : 0)))] || coinDatas.advancedRanks[coinDatas.advancedRanks.length - 1];
        const taggedData = await Users.findOne({ userID: member.user.id });
        const data = await Inviter.findOne({ guildID: message.guild.id, userID: member.user.id });
        const total = data ? data.total : 0;
        const bonus = data ? data.bonus : 0;
        const toplamData = await Users.findOne({ userID: member.user.id });
        const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: member.id });
        const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: member.user.id });
        const cezapuanData = await Penalties.findOne({ guildID: message.guild.id, userID: member.user.id });
        let currentRank = coinDatas.advancedRanks.filter(x => (coinData ? Math.floor(coinData.coin) : 0) >= x.coin);
        currentRank = currentRank[currentRank.length - 1];

        const task = await tasks.find({ guildID: message.guild.id, userID: member.id })
        var gorevlerim = new Discord.MessageButton().setCustomId('gorevlerim').setLabel(`Görevler`).setStyle('DANGER');
        task.filter(x => {
            if (x.active) {
                gorevlerim.setStyle('DANGER').setDisabled(false);
            } else {
                gorevlerim.setStyle('PRIMARY').setDisabled(true);
            } 
        })
        const row = new Discord.MessageActionRow().addComponents([gorevlerim])

        const coinStatus = aris.coinSystem && message.member.roles.cache.has(aris.registerHammer, false) && coinDatas.advancedRanks.length > 0 ?
            `
**${emojis.star} Yetki Durumu:** 
${progressBar(coinData ? Math.floor(coinData.coin) : 0, maxValue.coin, 8)} \`${coinData ? Math.floor(coinData.coin) : 0} / ${maxValue.coin}\`
${currentRank ? `${currentRank !== coinDatas.advancedRanks[coinDatas.advancedRanks.length - 1] ? `Şu an ${Array.isArray(currentRank.role) ? currentRank.role.map(x => `<@&${x}>`).join(", ") : `<@&${currentRank.role}>`} rolündesiniz. ${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `<@&${maxValue.role}>`} rolüne ulaşmak için \`${Math.floor(maxValue.coin - coinData.coin)}\` coin daha kazanmanız gerekiyor!` : "Şu an son yetkidesiniz! Emekleriniz için teşekkür ederiz."}` : `${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `<@&${maxValue.role}>`} rolüne ulaşmak için \`${maxValue.coin - (coinData ? Math.floor(coinData.coin) : 0)}\` coin daha kazanmanız gerekiyor!`}` : "";

        embed.setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }))
        embed.setAuthor(member.user.username, member.user.avatarURL({ dynamic: true, size: 2048 }))
        embed.setFooter(`Developed By Aris.`)
        embed.setDescription(`${member} (${member.roles.highest}) kişisinin sunucu içerisi yetki statleri aşağıda belirtilmiştir.
${coinStatus}
${emojis.star} Puan Durumu :
${emojis.nokta} Toplam  Puan : \`${coinData ? Math.floor(coinData.coin) : 0}\`, Gereken: \`${maxValue.coin}\` 
${emojis.nokta} Kayıt Durumu : \`${toplamData ? toplamData.kayit.length : 0} Adet\`
${emojis.nokta} Taglı Durumu : \`${taggedData ? taggedData.Taggeds.length : 0} Adet\`  
${emojis.nokta} Davet Durumu : \`${total + bonus} Adet\` 
${emojis.nokta} Chat  Durumu : \`${messageData ? messageData.topStat : 0} Mesaj\`
${emojis.nokta} Ses   Durumu : \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika] s [saniye]")}\`
${emojis.nokta} Ceza  Durumu : \`${cezapuanData ? cezapuanData.cezapuan : 0}\` (Toplam ${cezapuanData ? cezapuanData.cezasayi.length : 0} Ceza)
    `)
        let stat = await message.channel.send({ embeds: [embed], components: [row] })
        var filter = (button) => button.user.id === message.author.id;
        const collector = stat.createMessageComponentCollector({ filter })
        collector.on('collect', async (button, user) => {
            if (button.customId == "gorevlerim") {
                await button.deferUpdate();
                const mtask = await tasks.find({ guildID: message.guild.id, userID: member.user.id });
                if (stat) await stat.edit({
                    embeds: [embed.setDescription(`
Toplam Görev Sayısı: \`${mtask.length}\`
Tamamlanmış Görev Sayısı: \`${mtask.filter((x) => x.completed).length}\`
Tamamlanmamış Görev Sayısı: \`${mtask.filter((x) => !x.completed).length}\`
Aktif Görev Sayısı: \`${mtask.filter((x) => x.active).length}\`
      
${mtask.filter((x) => x.active).map((x) => `\`#${x.id}\` ${x.message} \n${x.completedCount >= x.count ? emojis.onay + " **Tamamlandı!**" : `${progressBar(x.completedCount, x.count, 8)} \`${x.type === "ses" ? `${moment.duration(x.completedCount).format("H [saat], m [dk], s [sn]")} / ${moment.duration(x.count).format("H [saat], m [dk], s [sn]")}` : `${x.completedCount} / ${x.count}`}\` \nKalan Süre: \`${moment.duration(x.finishDate - Date.now()).format("H [saat], m [dakika] s [saniye]")}\` \nÖdül: ${emojis.onay} \`${x.prizeCount} coin\``}`).join("\n\n")}        
`)], components: []
                })
            }
        })
    }
}

module.exports = YStat



function progressBar(value, maxValue, size) {
    const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
    const emptyProgress = size - progress > 0 ? size - progress : 0;

    const progressText = emojis.fill.repeat(progress);
    const emptyProgressText = emojis.empty.repeat(emptyProgress);

    return emptyProgress > 0 ? emojis.fillStart + progressText + emptyProgressText + emojis.emptyEnd : emojis.fillStart + progressText + emptyProgressText + emojis.fillEnd;
};