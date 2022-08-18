const Discord = require("discord.js");
const { ariscik } = require("../../../Helpers/Schemas")
class UserUpdate {
    Event = "userUpdate"
    async run(old, nev) {
        const aris = await ariscik.findOne({ guildID: config.guildID })
        const guild = client.guilds.cache.get(config.guildID)
        let user = guild.members.cache.get(old.id);
        if (!user) return;
        if (!guild) return;
        if (old.discriminator == nev.discriminator || old.bot || nev.bot) {
            return;
        } else try {
            let etiket = aris.tags.filter(discrim => !isNaN(discrim))[0]
            if (nev.discriminator !== old.discriminator) {
                if (aris?.etiketTag && old.discriminator == etiket && nev.discriminator !== etiket) {
                    user.setRoles(aris.unregisterRole).catch(e => { }); user.roles.add(aris.etkinlikRole); user.roles.add(aris.cekilisRole);
                    if (log) log.send(`${uye}, adlı üye **( #1953 )** tagını kullanıcı adından silerek aramızdan ayrıldı!\n\n─────────────────\n\nÖnce ${old.tag} | Sonra: ${nev.tag} <@&992118566612648027>`)
                } else if (old.discriminator !== etiket && nev.discriminator == etiket) {
                    user.roles.add(aris?.tagRol).catch(err => { })
                    if (log) log.send(`${user}, adlı üye **( #1953 )** tagını kullanıcı adına ekleyerek ailemize katıldı!\n\n─────────────────\n\nÖnce: ${old.tag} | Sonra: ${nev.tag} <@&992118559125803089>`)
                }
            }

        } catch (error) {
            client.logger.error(`Etkinlik: ${module.exports.name} \nHata: ` + error + ``)
        }
    }
}

module.exports = UserUpdate