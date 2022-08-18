const { talentPerms } = require("../../../Helpers/Schemas");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
class Message {
    Event = "messageCreate"
    async run(message) {
        if (!message.guild || message.channel.type === "dm") return;
        let data = await talentPerms.find({ guildID: message.guild.id }) || [];
        let ozelkomutlar = data;
        let yazilanKomut = message.content.split(" ")[0];
        let args = message.content.split(" ").slice(1);
        yazilanKomut = yazilanKomut.slice(config.prefix.some(x => x.length));
        let komut = ozelkomutlar.find(x => x.komutAd.toLowerCase() === yazilanKomut);
        if (!komut) return;

        let verilenRol = message.guild.roles.cache.some(rol => komut.verilcekRol.includes(rol.id));
        if (!verilenRol) return;

        let üye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (message.member.roles.cache.some(rol => komut.YetkiliRol.includes(rol.id)) || message.member.permissions.has("ADMINISTRATOR")) {
            if (!üye) return message.reply({ embeds: [new Discord.MessageEmbed().setDescription(`**UYARI : **Lütfen rol verilecek kişiyi etiketle!`)] }).sil(5)
            if (!komut.verilcekRol.some(rol => üye.roles.cache.has(rol))) {
                üye.roles.add(komut.verilcekRol)
                message.react(emojis.onay)
                message.channel.send({ embeds: [new Discord.MessageEmbed().setDescription(`${emojis.onay} Başarılı şekilde ${üye} kişisine ${komut.verilcekRol.map(x => `<@&${x}>`)} rolünü verdim!`)] }).sil(10)
            } else {
                üye.roles.remove(komut.verilcekRol)
                message.react(emojis.onay)
                message.channel.send({ embeds: [new Discord.MessageEmbed().setDescription(`${emojis.onay} Başarılı şekilde ${üye} kişisinden ${komut.verilcekRol.map(x => `<@&${x}>`)} rolünü aldım!`)] }).sil(10)
            }
        }
    }
}
module.exports = Message