const { roleBackup, ariscik, channelBackup } = require("../Helpers/Schemas");
class Backup {
    static async RoleBackup() {
        await roleBackup.deleteMany()
        const aris = await ariscik.findOne({ guildID: config.guildID })
        const guild = client.guilds.cache.get(config.guildID);
        if (guild) {
            const roles = guild.roles.cache.filter(r => r.name !== "@everyone").array();
            for (let index = 0; index < roles.length; index++) {
                const role = roles[index];
                let Overwrites = [];
                await guild.channels.cache.filter(channel => channel.permissionOverwrites.cache.has(role.id)).forEach(channel => {
                    let channelPerm = channel.permissionOverwrites.cache.get(role.id);
                    let perms = { id: channel.id, allow: channelPerm.allow.toArray(), deny: channelPerm.deny.toArray() };
                    Overwrites.push(perms);
                });

                await roleBackup.findOne({ roleID: role.id }, async (err, data) => {
                    if (!data) {
                        const newData = new roleBackup({
                            roleID: role.id,
                            name: role.name,
                            color: role.hexColor,
                            hoist: role.hoist,
                            position: role.position,
                            permissions: role.permissions.bitfield,
                            mentionable: role.mentionable,
                            time: Date.now(),
                            members: role.members.map(m => m.id),
                            channelOverwrites: Overwrites
                        });
                        newData.save();
                    } else {
                        data.name = role.name;
                        data.color = role.hexColor;
                        data.hoist = role.hoist;
                        data.position = role.position;
                        data.permissions = role.permissions.bitfield;
                        data.mentionable = role.mentionable;
                        data.time = Date.now();
                        data.members = role.members.map(m => m.id);
                        data.channelOverwrites = Overwrites;
                        data.save();
                    };
                });
            }
            await roleBackup.find({}, (err, roles) => {
                roles.filter(r => !guild.roles.cache.has(r.roleID) && Date.now() - r.time > 1000 * 60).forEach(r => {
                    r.remove()
                });
            });
            await client.logger.log(`Rol veri tabanı düzenlendi!`, "log");
            if (aris.guardLog) client.channels.cache.get(aris.guardLog).send(`${emojis.onay} Güvenlik amaçlı rol verileri yedeklendi!`)
        };
    }
    static async channelBackup() {
        await channelBackup.deleteMany()
        const aris = await ariscik.findOne({ guildID: config.guildID })
        const guild = client.guilds.cache.get(config.guildID)
        if (guild) {
            const channels = guild.channels.cache.array();
            for (let index = 0; index < channels.length; index++) {
                const channel = channels[index];
                let ChannelPermissions = []
                channel.permissionOverwrites.cache.forEach(perm => {
                    ChannelPermissions.push({ id: perm.id, type: perm.type, allow: "" + perm.allow, deny: "" + perm.deny })
                });
                if ((channel.type === 'GUILD_TEXT') || (channel.type === 'GUILD_NEWS')) {
                    await channelBackup.findOne({ channelID: channel.id }, async (err, kanalYedek) => {
                        if (!kanalYedek) {
                            const newData = new channelBackup({
                                channelID: channel.id,
                                type: channel.type,
                                name: channel.name,
                                nsfw: channel.nsfw,
                                parentID: channel.parentId,
                                position: channel.position,
                                rateLimit: channel.rateLimitPerUser,
                                overwrites: ChannelPermissions,
                            });
                            await newData.save();
                        } else {
                            kanalYedek.name = channel.name,
                                kanalYedek.type = channel.type,
                                kanalYedek.nsfw = channel.nsfw,
                                kanalYedek.parentID = channel.parentId,
                                kanalYedek.position = channel.position,
                                kanalYedek.rateLimit = channel.rateLimitPerUser,
                                kanalYedek.overwrites = ChannelPermissions
                            kanalYedek.save();
                        };
                    });
                }
                if (channel.type === 'GUILD_VOICE') {
                    await channelBackup.findOne({ channelID: channel.id }, async (err, kanalYedek) => {
                        if (!kanalYedek) {
                            const newData = new channelBackup({
                                channelID: channel.id,
                                type: channel.type,
                                name: channel.name,
                                bitrate: channel.bitrate,
                                parentID: channel.parentId,
                                position: channel.position,
                                overwrites: ChannelPermissions,
                            });
                            await newData.save();
                        } else {
                            kanalYedek.name = channel.name,
                            kanalYedek.type = channel.type,
                                kanalYedek.bitrate = channel.bitrate,
                                kanalYedek.parentID = channel.parentId,
                                kanalYedek.position = channel.position,
                                kanalYedek.overwrites = ChannelPermissions
                            kanalYedek.save();
                        };
                    });
                }
                if (channel.type === 'GUILD_CATEGORY') {
                    await channelBackup.findOne({ channelID: channel.id }, async (err, kanalYedek) => {
                        if (!kanalYedek) {
                            const newData = new channelBackup({
                                channelID: channel.id,
                                type: channel.type,
                                name: channel.name,
                                position: channel.position,
                                overwrites: ChannelPermissions,
                            });
                            await newData.save();
                        } else {
                            kanalYedek.name = channel.name,
                            kanalYedek.type = channel.type,
                                kanalYedek.position = channel.position,
                                kanalYedek.overwrites = ChannelPermissions
                            kanalYedek.save();
                        };
                    });
                }
            }
            await client.logger.log(`Kanal veri tabanı düzenlendi!`, "log");
            if (aris.guardLog) client.channels.cache.get(aris.guardLog).send(`${emojis.onay} Güvenlik amaçlı kanal verileri yedeklendi!`)
        }
    }
}
module.exports = Backup;