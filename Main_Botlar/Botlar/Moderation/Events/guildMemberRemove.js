const { ariscik, Penalties, Inviter, Users, coin } = require('../../../Helpers/Schemas')
class GuildMemberRemove {
    Event = "guildMemberRemove"
    async run(member) {
        const aris = await ariscik.findOne({ guildID: member.guild.id })
        if (member.user.bot) return;
        try {
        await Users.updateOne({ userID: member.id }, { $unset: { Teyitci: {} } });
        await Users.findOneAndUpdate({ $pull: { Taggeds: { userID: member.id } } });
        const channel = client.channels.cache.get(aris.inviteLog);
        if (!channel) return;
        if (member.user.bot) return channel.send({ content: `**${member.user.tag}** sunucumuzdan ayrıldı! Davet eden: **Davetçi bulunamadı**` })
        const inviteMemberData = await Users.findOne({ userID: member.user.id }) || [];
        if (!inviteMemberData.Inviter) {
            return channel.send({ content: `**${member.user.tag}** sunucumuzdan ayrıldı! Davet eden: **Davetçi bulunamadı**` });
        } else if (inviteMemberData.Inviter.inviter === member.guild.id) {
            await Inviter.findOneAndUpdate({ guildID: member.guild.id, userID: member.guild.id }, { $inc: { total: -1 } }, { upsert: true });
            const inviterData = await Inviter.findOne({ guildID: member.guild.id, userID: member.guild.id });
            const total = inviterData ? inviterData.total : 0;
            return channel.send({ content: `**${member.user.tag}** sunucumuzdan ayrıldı! Davet eden: \`Sunucu Özel URL\` (**${total}** davet)` });
        } else {
            if (Date.now() - member.user.createdTimestamp <= config.userTime) {
                const inviter = await client.users.fetch(inviteMemberData.Inviter.inviter);
                const inviterData = await Inviter.findOne({ guildID: member.guild.id, userID: inviter.id, });
                const total = inviterData ? inviterData.total : 0;
                return channel.send({ content: `**${member.user.tag}** sunucumuzdan ayrıldı! Davet eden: **${inviter.tag}** (**${total}** davet)` })
            } else {
                const inviter = await client.users.fetch(inviteMemberData.Inviter.inviter);
                await Inviter.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { leave: 1, total: -1 } }, { upsert: true });
                const inviterData = await Inviter.findOne({ guildID: member.guild.id, userID: inviter.id, });
                const total = inviterData ? inviterData.total : 0;
                const inviterMember = member.guild.members.cache.get(inviter.id);
                if (inviterMember) await inviterMember.updateTask(member.guild.id, "invite", -1);
                return channel.send({ content: `**${member.user.tag}** sunucumuzdan ayrıldı! Davet eden: **${inviter.tag}** (**${total}** davet)` });
            } 
        }   
    } catch(e) {
        client.logger.error(`Etkinlik: ${module.exports.name} \nHata: ` + e + ``)
    } 
    }
}

module.exports = GuildMemberRemove

