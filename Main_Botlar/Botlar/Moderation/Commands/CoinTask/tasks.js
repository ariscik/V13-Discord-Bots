const { ariscik, tasks } = require('../../../../Helpers/Schemas')
const moment = require("moment"); require("moment-duration-format");
class Tasks extends Command {
    constructor(client) {
        super(client, {
            name: "tasks",
            aliases: ["görevlerim", "görevler", "yapmamgereken"],
            cooldown: 10
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!aris.commandsChannel.some(kanal => message.channel.id.includes(kanal))) return message.reply(`**UYARI:** Bu komutu yalnızca <#${aris.commandsChannel[0]}> kanalında kullanabilirsin!`).sil(10)
        if (!message.member.roles.cache.has(aris.registerHammer) && !aris.yonetimRoles.some(rol => message.member.roles.cache.has(rol))) return message.reply(`**UYARI: **Bu komutu kullanmak için yeterli yetkiye sahip değilsin!`).sil(10);
              const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const mtask = await tasks.find({ guildID: message.guild.id, userID: member.user.id });
        message.channel.send({
            embeds: [embed.setDescription(`
Toplam Görev Sayısı: \`${mtask.length}\`
Tamamlanmış Görev Sayısı: \`${mtask.filter((x) => x.completed).length}\`
Tamamlanmamış Görev Sayısı: \`${mtask.filter((x) => !x.completed).length}\`
Aktif Görev Sayısı: \`${mtask.filter((x) => x.active).length}\`

${mtask.filter((x) => x.active).map((x) => `\`#${x.id}\` ${x.message} \n${x.completedCount >= x.count ? emojis.onay + " **Tamamlandı!**" : `${progressBar(x.completedCount, x.count, 8)} \`${x.type === "ses" ? `${moment.duration(x.completedCount).format("H [saat], m [dk], s [sn]")} / ${moment.duration(x.count).format("H [saat], m [dk], s [sn]")}` : `${x.completedCount} / ${x.count}`}\` \nKalan Süre: \`${moment.duration(x.finishDate - Date.now()).format("H [saat], m [dakika] s [saniye]")}\` \nÖdül: ${emojis.onay} \`${x.prizeCount} coin\``}`).join("\n\n")}        
`)]
        })
    }
}

module.exports = Tasks



function progressBar(value, maxValue, size) {
    const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
    const emptyProgress = size - progress > 0 ? size - progress : 0;

    const progressText = emojis.fill.repeat(progress);
    const emptyProgressText = emojis.empty.repeat(emptyProgress);

    return emptyProgress > 0 ? emojis.fillStart + progressText + emptyProgressText + emojis.emptyEnd : emojis.fillStart + progressText + emptyProgressText + emojis.fillEnd;
};