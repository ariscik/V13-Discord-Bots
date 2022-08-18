const {  ariscik } = require("../../../../Helpers/Schemas")
const {rolVer} = require("../../../../Helpers/BackupFunction")
class Herkese extends Command {
    constructor(client) {
        super(client, {
            name: "herkeserolver",
            aliases: ["herkeserol","herkeserolver"],
            Founder: true,
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
        if (!role) return message.reply(`**UYARI :** Bir rol belirtmeyi unuttun! Rol belirtip tekrar dene!`).sil(10)
        else if (role) {
          await message.reply({ embeds: [embed.setDescription(`${role} isimli rol sunucuda bulunan toplam ${message.guild.members.cache.filter(member => !member.roles.cache.has(role.id) && !member.user.bot).size} kişiye dağıtılıyor.`)] })
          if(aris.denetimLog) await client.channels.cache.get(aris.denetimLog).send({ embeds: [embed.setDescription(`${role} isimli rol sunucuda bulunan tüm üyeler ${message.author} tarafından dağıtılmaya başlandı!`)]})
          rolVer(message.guild, role)
        }
    }
};

module.exports = Herkese