const { ariscik, Inviter, Users } = require("../../../../Helpers/Schemas")
class inviter extends Command {
    constructor(client) {
        super(client, {
            name: "inviter",
            aliases: ["inviters","inviter"],
            Founder: true,
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
        var amount = args[2]
        if (!args[0] || args[0].toLowerCase() !== "ekle" && args[0].toLowerCase() !== "sil" && args[0].toLowerCase() !== "sorgu") return message.reply({ embeds: [embed.setDescription(`Lütfen \`ekle/sil/sorgu/üyeler\` olmak üzere geçerli bir eylem belirtin ${emojis.iptal}`)] }).sil(10); if (!member) return message.reply(`**UYARI :** Bir üye belirtmeyi unuttun!`).sil(20)
        if (!args[0] || args[0].toLowerCase() === "ekle") { if (!args[2] || isNaN(amount)) return message.reply({ embeds: [embed.setDescription(`Lütfen bonus davet sayısına eklemek için geçerli bir miktar belirtin ${emojis.iptal}`)] }); await Inviter.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { bonus: parseInt(amount) } }, { upsert: true }); message.reply({ embeds: [embed.setDescription(`${member.toString()} üyesine **${amount}** adet bonus davet eklendi ${emojis.onay}`)] });
        } else if (!args[0] || args[0].toLowerCase() === "sil") { const data = await Inviter.findOne({ guildID: message.guild.id, userID: member.user.id }); if (!data) return message.reply({ embeds: [embed.setDescription(`Bu kullanıcının herhangi bir davet verisi bulunmuyor ${emojis.iptal}`)] }); if (!data.bonus) return message.reply({ embeds: [embed.setDescription(`Kullanıcıda bonus davet bulunmuyor ${emojis.iptal}`)] }); if (!args[2] || isNaN(amount)) return message.reply({ embeds: [embed.setDescription(`Lütfen bonus davet sayısından çıkarmak için geçerli bir miktar belirtin ${emojis.iptal}`)] }); if (data.bonus < args[2]) return message.reply({ embeds: [embed.setDescription(`Kullanıcı girilen sayı miktarı kadar bonusa sahip değil ${emojis.iptal}`)] })
          else { data.bonus -= parseInt(amount); data.save(); message.reply({ embeds: [embed.setDescription(`${member.toString()} üyesinden **${amount}** adet bonus davet çıkarıldı ${emojis.onay}`)] }); }
        } else if (!args[0] || args[0].toLowerCase() === "sorgu") { const data = await Users.findOne({ userID: member.user.id }); if (!data?.Inviter) return message.reply({ embeds: [embed.setDescription(`Bu kullanıcıyı kimin davet ettiğini bulamadım ${emojis.iptal}`)] })
          else { if (data.Inviter.inviter === message.guild.id) { return message.reply({ embeds: [embed.setDescription(`${member.toString()} üyesi, ${new Date(member.joinedAt).toTurkishFormatDate()} tarihinde **${message.guild.name}** tarafından davet edilmiş.`)] });
            } else { const inviter = await client.users.fetch(data.Inviter.inviter); return message.reply({ embeds: [embed.setDescription(`${member.toString()} üyesi, ${new Date(member.joinedAt).toTurkishFormatDate()} tarihinde **${inviter.tag}** \`(${inviter.id})\` tarafından davet edilmiş.`)] }); }
          }
        } else if(!args[0] || args[0].toLowerCase() === "üyeler") { if(!member) return message.reply(`**UYARI :** Bir rol belirtmeyi unuttun!`).sil(10); const data = await Users.find({}); const filtered = data.filter(x => message.guild.members.cache.get(x.userID) && x?.Inviter.inviter === message.author.id); await message.reply({ embeds: [embed.setDescription(filtered.length > 0 ? filtered.map(usr => `<@${usr.userID}> - **${moment(usr.Inviter.date).format("LLL")}** tarihinde.`).join("\n") : "Kimseyi davet etmemiş!")] }) }
    }
};

module.exports = inviter