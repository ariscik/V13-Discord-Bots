const { Users } = require("../../../Helpers/Schemas");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
class Message {
    Event = "messageCreate"
    async run(message) {
        if (message.author.bot || !message.guild || message.channel.type == "dm") return;
        const data = await Users.findOne({ userID: message.author.id }) || [];
        if (data.AfkStatus) {
            await Users.updateOne({ userID: message.author.id }, { $unset: { AfkStatus: {} } });
            if (message.member.displayName.includes("[AFK]") && message.member.manageable) await message.member.setNickname(message.member.displayName.replace("[AFK]", ""));
            message.channel.send({ embeds: [new Discord.MessageEmbed().setColor('RANDOM').setDescription(`${message.member} adlı kullanıcı **AFK** modundan çıktı! Tekrar hoş geldin!\nKullanıcı **${moment.duration(Date.now() - data.AfkStatus.date).format("d [gün] H [saat], m [dakika] s [saniye]")}** den beri **${data.AfkStatus.reason}** sebebiyle **AFK** modundaydı!`)] }).then(e => setTimeout(() => e.delete(), 7000))
        }
        const member = message.mentions.members.first();
        if (!member) return;
        const afkData = await Users.findOne({ userID: member.user.id }) || []
        if (!afkData.AfkStatus) return;
        await message.channel.send({ embeds: [new Discord.MessageEmbed().setColor('RANDOM').setDescription(`<@` + message.author.id + `> Etiketlediğiniz kullanıcı **${moment.duration(Date.now() - afkData.AfkStatus.date).format("d [gün] H [saat], m [dakika] s [saniye]")}** den beri, **${afkData.AfkStatus.reason}** sebebiyle **AFK**`)] }).then(e => setTimeout(() => e.delete(), 7000))
    }
}
module.exports = Message