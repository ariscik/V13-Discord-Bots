const { ariscik, Inviter } = require('../../../../Helpers/Schemas')
class Invite extends Command {
    constructor(client) {
        super(client, {
            name: "invite",
            aliases: ["invites"],
            cooldown: 15
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        if (!aris.commandsChannel.some(kanal => message.channel.id.includes(kanal))) return message.reply(`**UYARI:** Bu komutu yalnızca <#${aris.commandsChannel[0]}> kanalında kullanabilirsin!`).sil(10)
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const data = await Inviter.findOne({ guildID: message.guild.id, userID: member.user.id }); const total = data ? data.total : 0; const regular = data ? data.regular : 0; const bonus = data ? data.bonus : 0; const leave = data ? data.leave : 0; const fake = data ? data.fake : 0; const invMember = await Inviter.find({ guildID: message.guild.id, inviter: member.user.id }); const daily = invMember ? message.guild.members.cache.filter((usr) => invMember.some((x) => x.userID === usr.user.id) && Date.now() - usr.joinedTimestamp < 1000 * 60 * 60 * 24).size : 0; const weekly = invMember ? message.guild.members.cache.filter((usr) => invMember.some((x) => x.userID === usr.user.id) && Date.now() - usr.joinedTimestamp < 1000 * 60 * 60 * 24 * 7).size : 0;
        message.reply({ embeds: [embed.setAuthor(member.user.username, member.user.avatarURL({ dynamic: true })).setTimestamp().setDescription(`Toplam **${total + bonus}** davete sahip. (**${regular}** giren, **${leave}** ayrılmış, **${fake}** sahte, **${bonus}** bonus)`)] });
    
    }
}

module.exports = Invite