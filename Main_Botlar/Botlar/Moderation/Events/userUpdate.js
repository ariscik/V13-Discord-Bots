const Discord = require("discord.js");
const { ariscik } = require("../../../Helpers/Schemas")
class UserUpdate {
    Event = "userUpdate"
    async run(old, nev) {
        const guild = client.guilds.cache.get(config.guildID)
        if (!guild) return;
        if (old.username == nev.username || old.bot || nev.bot) {
            return;
        } else try {
            const aris = await ariscik.findOne({ guildID: config.guildID }); let guild = await (client.guilds.cache.get(config.guildID)); let uye = guild.members.cache.get(old.id); let tagrol = guild.roles.cache.get(aris.tagRol); let log = guild.channels.cache.get(aris.tagLog)
            if (old.username != nev.username || old.tag != nev.tag || old.discriminator != nev.discriminator) {
                if (aris.tags.some(tag => nev.tag.toLowerCase().includes(tag))) {
                    if (!uye.roles.cache.has(tagrol.id)) {
                        uye.roles.add(tagrol.id).catch(e => { }); if (log) log.send(`${uye}, adlı üye **( ${aris.tags.filter(a => uye.user.username.includes(a) || uye.user.discriminator == a.replace("#", "")).map(a => a).join(", ")} )** tagını kullanıcı adına ekleyerek ailemize katıldı!\n\n─────────────────\n\nÖnce: ${old.tag} | Sonra: ${nev.tag} <@&992118559125803089>`)
                    } else { return; }
                } else {
                    if (!uye.roles.cache.has(tagrol.id)) {
                        return;
                    } else { uye.setRoles(aris.unregisterRole).catch(e => { }); uye.roles.add(aris.etkinlikRole); uye.roles.add(aris.cekilisRole); if (log) log.send(`${uye}, adlı üye **( ${aris.tags.filter(a => uye.user.username.includes(a) || uye.user.discriminator == a.replace("#", "")).map(a => a).join(", ")} )** tagını kullanıcı adından silerek aramızdan ayrıldı!\n\n─────────────────\n\nÖnce ${old.tag} | Sonra: ${nev.tag}\n<@&992118566612648027>`) }
                }
            }

        } catch (error) {
            client.logger.error(`Etkinlik: ${module.exports.name} \nHata: ` + error + ``)
        }
    }
}

module.exports = UserUpdate