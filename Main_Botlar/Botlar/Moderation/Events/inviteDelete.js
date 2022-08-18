const Discord = require("discord.js");
class InviteDelete {
  Event = "inviteDelete"
  async run(invite) {
    setTimeout(async () => { invite.guild.invites.fetch().then((guildInvites) => { const cacheInvites = new Discord.Collection(); guildInvites.map((inv) => { cacheInvites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter }); }); client.invites.set(invite.guild.id, cacheInvites); }); }, 5000)
  }
}

module.exports = InviteDelete