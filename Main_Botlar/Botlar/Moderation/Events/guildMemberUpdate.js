const { RoleData, ariscik } = require('../../../Helpers/Schemas')
const moment = require('moment')
class GuildMemberUpdate {
    Event = "guildMemberUpdate"
    async run(newMember, oldMember) {
        try {
            const aris = await ariscik.findOne({ guildID: config.guildID })
            if (newMember.user.bot) return;
            if (oldMember.user.bot) return;
            await newMember.guild.fetchAuditLogs({
                type: "MEMBER_ROLE_UPDATE"
            }).then(async (audit) => {
                let ayar = audit.entries.first()
                let hedef = ayar.target
                let yapan = ayar.executor
                if (yapan.bot) return
                newMember.roles.cache.forEach(async role => {
                    if (!oldMember.roles.cache.has(role.id)) {
                        const emed = new Discord.MessageEmbed()
                            .setAuthor(hedef.tag, hedef.displayAvatarURL({ dynamic: true }))
                            .setColor("RANDOM")
                            .setDescription(`Kişinin eklenen ve alınan tüm rollerine bakmak için \`!rollog @Aris\` komutunu kullanın \n
                **Rol Eklenen kişi**\n ${hedef} - **${hedef.id}** `)
                            .addField(`${emojis.onay} Rolü Ekleyen Kişi`, `${yapan} - **${yapan.id}**`, false)
                            .addField(`${emojis.onay} Eklenen Rol`, `${role} - **${role.id}**`, false)
                            .setFooter(yapan.tag, yapan.displayAvatarURL({ dynamic: true }))
                            .setTimestamp()
                        if(aris.rolLog) client.channels.cache.get(aris.rolLog).send({ embeds: [emed] })
                        RoleData.findOne({
                            user: hedef.id
                        }, async (err, res) => {
                            if (!res) {
                                let arr = []
                                arr.push({
                                    rol: role.id,
                                    mod: yapan.id,
                                    user: hedef.id,
                                    tarih: moment(Date.now()).format("LLL"),
                                    state: "Ekleme"
                                })
                                let newData = new RoleData({
                                    user: hedef.id,
                                    rollers: arr
                                })
                                newData.save().catch(e => console.log(e))
                            } else {
                                res.rollers.push({
                                    rol: role.id,
                                    mod: yapan.id,
                                    user: hedef.id,
                                    tarih: moment(Date.now()).format("LLL"),
                                    state: "Ekleme"
                                })
                                res.save().catch(e => console.log(e))
                            }
                        })
                    }
                });
                oldMember.roles.cache.forEach(async role => {
                    if (!newMember.roles.cache.has(role.id)) {
                        const emeed = new Discord.MessageEmbed()
                            .setAuthor(hedef.tag, hedef.displayAvatarURL({ dynamic: true }))
                            .setColor("RANDOM")
                            .setDescription(`Kişinin alınan ve eklenen tüm rollerine bakmak için \`!rollog @Aris\` komutunu kullanın \n
                **Rolü Alınan kişi** \n${hedef} - **${hedef.id}**`)
                            .addField(`${emojis.iptal} Rolü Alan Kişi`, `${yapan} - **${yapan.id}**`, false)
                            .addField(`${emojis.iptal} Alınan Rol`, `${role} - **${role.id}**`, false)
                            .setFooter(yapan.tag, yapan.displayAvatarURL({ dynamic: true }))
                            .setTimestamp()
                        if(aris.rolLog) client.channels.cache.get(aris.rolLog).send({ embeds: [emeed] })
                        RoleData.findOne({
                            user: hedef.id
                        }, async (err, res) => {
                            if (!res) {
                                let arr = []
                                arr.push({
                                    rol: role.id,
                                    mod: yapan.id,
                                    user: hedef.id,
                                    tarih: moment(Date.now()).format("LLL"),
                                    state: "Kaldırma"
                                })
                                let newData = new RoleData({
                                    user: hedef.id,
                                    rollers: arr
                                })
                                newData.save().catch(e => console.log(e))
                            } else {
                                res.rollers.push({
                                    rol: role.id,
                                    mod: yapan.id,
                                    user: hedef.id,
                                    tarih: moment(Date.now()).format("LLL"),
                                    state: "Kaldırma"
                                })
                                res.save().catch(e => console.log(e))
                            }
                        })
                    }
                });
            })
    } catch(e) {
        client.logger.error(`Etkinlik: ${module.exports.name} \nHata: ` + e + ``)
    } 
    }
}

module.exports = GuildMemberUpdate

