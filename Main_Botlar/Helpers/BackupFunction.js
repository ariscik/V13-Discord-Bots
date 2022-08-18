const { roleBackup } = require("../Helpers/Schemas")
const Bots = require("../Botlar/main")
module.exports = {
  rolVer(sunucu, role) {
    let length = (sunucu.members.cache.filter(member => member && !member.roles.cache.has(role.id) && !member.user.bot).array().length + 5);
    const sayı = Math.floor(length / Bots.length);
    for (let index = 0; index < Bots.length; index++) {
      const bot = Bots[index];
      if (role.deleted) {
        client.logger.log(`[${role.id}] - ${bot.user.tag}`);
        break;
      }
      const members = bot.guilds.cache.get(sunucu.id).members.cache.filter(member => !member.roles.cache.has(role.id) && !member.user.bot).array().slice((index * sayı), ((index + 1) * sayı));
      if (members.length <= 0) return;
      for (const member of members) {
        member.roles.add(role.id)
      }
    }
  },
  rolKur(role, newRole) {
    roleBackup.findOne({ roleID: role }, async (err, data) => {
      let length = (data.members.length + 5);
      const sayı = Math.floor(length / Bots.length);
      if (sayı < 1) sayı = 1;
      const channelPerm = data.channelOverwrites.filter(e => client.guilds.cache.get(config.guildID).channels.cache.get(e.id))
      for await (const perm of channelPerm) {
        const bott = Bots[1]
        const guild2 = bott.guilds.cache.get(config.guildID)
        let kanal = guild2.channels.cache.get(perm.id);
        if(!kanal) return;
        let newPerm = {};
        perm.allow.forEach(p => {
          newPerm[p] = true;
        });
        perm.deny.forEach(p => {
          newPerm[p] = false;
        });
        kanal.permissionOverwrites.create(newRole, newPerm).catch(error => client.logger.error(error));
      }
      for (let index = 0; index < Bots.length; index++) {
        const bot = Bots[index];
        const guild = bot.guilds.cache.get(config.guildID);
        if (newRole.deleted) {
          client.logger.log(`[${role}] - ${bot.user.tag} - Rol Silindi Dağıtım İptal`);
          break;
        }
        const members = data.members.filter(e => guild.members.cache.get(e) && !guild.members.cache.get(e).roles.cache.has(newRole)).slice((index * sayı), ((index + 1) * sayı));
        if (members.length <= 0) {
          client.logger.log(`[${role}] Olayında kayıtlı üye olmadığından veya rol üyelerine dağıtıldığından dolayı rol dağıtımı gerçekleştirmedim.`);
          break;
        }
        for await (const user of members) {
          const member = guild.members.cache.get(user)
          member.roles.add(newRole.id)
        }
      }
      const newData = new roleBackup({
        roleID: newRole.id,
        name: newRole.name,
        color: newRole.hexColor,
        hoist: newRole.hoist,
        position: newRole.position,
        permissions: newRole.permissions.bitfield,
        mentionable: newRole.mentionable,
        time: Date.now(),
        members: data.members.filter(e => newRole.guild.members.cache.get(e)),
        channelOverwrites: data.channelOverwrites.filter(e => newRole.guild.channels.cache.get(e.id))
      });
      newData.save();
    })
  },
}