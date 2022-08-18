const { ariscik, roleBackup } = require("../../../Helpers/Schemas")
const { guvenli } = require("../../../Helpers/function")
const { rolKur } = require("../../../Helpers/BackupFunction")
class roleDelete {
  Event = "roleDelete"
  async run(role) {
    const aris = await ariscik.findOne({ guildID: config.guildID })
    if (aris.channelGuard === true) try {
        let entry = await role.guild.fetchAuditLogs({ type: 'ROLE_DELETE' }).then(audit => audit.entries.first());
        if (!entry || Date.now() - entry.createdTimestamp > 5000 || await guvenli(entry.executor.id)) return;
        const channel = client.channels.cache.get(aris.guardLog)
        const roleData = await roleBackup.findOne({ roleID: role.id })
        const newRole = await role.guild.roles.create({ name: roleData ? roleData.name : role.name, color: roleData ? roleData.color : role.color, hoist: roleData ? roleData.hoist : role.hoist, position: roleData ? roleData.position : role.rawPosition, permissions: roleData ? roleData.permissions : role.permissions, mentionable: roleData ? roleData.mentionable : role.mentionable, reason: "Rol Silindiği İçin Tekrar Oluşturuldu!" });
        await roleBackup.findOne({ roleID: role.id }, async (err, data) => { if (!data) { if (channel) channel.send({ content: `[${role.id}] ID'li rol silindi fakar datamda herhangi bir veri bulamadım! İşlemleri malesef gerçekleştiremiyorum!` }); console.log(`[${role.id}] ID'li rol silindi fakat herhangi bir veri olmadığı için işlem yapılmadı.`); return } rolKur(role.id, newRole) });
        if (role === aris.banHammer) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { banHammer: newRole.id } }, { upsert: true }).exec(); }

        if (role === aris.jailHammer) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { jailHammer: newRole.id } }, { upsert: true }).exec(); }

        if (role === aris.muteHammer) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { muteHammer: newRole.id } }, { upsert: true }).exec(); }

        if (role === aris.vmuteHammer) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { vmuteHammer: newRole.id } }, { upsert: true }).exec(); }

        if (role === aris.clownhammer) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { clownHammer: newRole.id } }, { upsert: true }).exec(); }

        if (role === aris.moveHammer) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { moveHammer: newRole.id } }, { upsert: true }).exec(); }

        if (role === aris.registerHammer) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { registerHammer: newRole.id } }, { upsert: true }).exec(); }

        if (role === aris.unregisterRole) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { unregisterRole: newRole.id } }, { upsert: true }).exec(); }

        if (role === aris.tagRol) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { tagRol: newRole.id } }, { upsert: true }).exec(); }

        if (role === aris.mutedRol) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { mutedRol: newRole.id } }, { upsert: true }).exec(); }

        if (role === aris.vmutedRol) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { vmutedRol: newRole.id } }, { upsert: true }).exec();}

        if (role === aris.jailedRole) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { jailedRole: newRole.id } }, { upsert: true }).exec();}

        if (role === aris.etkinlikRole) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { etkinlikRole: newRole.id } }, { upsert: true }).exec(); }

        if (role === aris.cekilisRole) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { cekilisRole: newRole.id } }, { upsert: true }).exec(); }
    
        if (aris.manRoles.includes(role)) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $pull: { manRoles: role } }, { upsert: true }).exec(); await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $push: { manRoles: newRole.id } }, { upsert: true }).exec(); }

        if (aris.womanRoles.includes(role)) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $pull: { womanRoles: role } }, { upsert: true }).exec(); await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $push: { womanRoles: newRole.id } }, { upsert: true }).exec(); }

        if (aris.yonetimRoles.includes(role)) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $pull: { yonetimRoles: role } }, { upsert: true }).exec(); await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $push: { yonetimRoles: newRole.id } }, { upsert: true }).exec(); }
    
      } catch (error) { console.log(`Etkinlik : Role Delete - Hata : ` + error) }
  }
}

module.exports = roleDelete