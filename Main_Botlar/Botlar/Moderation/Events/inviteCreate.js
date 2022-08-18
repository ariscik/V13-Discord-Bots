const Discord = require("discord.js");
class InviteCreate {
  Event = "inviteCreate"
  async run(invite) {
    invite.guild.invites.fetch().then((guildInvites) => { const cacheInvites = new Discord.Collection(); guildInvites.map((inv) => { cacheInvites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter }); }); client.invites.set(invite.guild.id, cacheInvites); });
  }
}

module.exports = InviteCreate