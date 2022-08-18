const { ariscik, Inviter, Users } = require("../../../../Helpers/Schemas")
class Rolbilgi extends Command {
    constructor(client) {
        super(client, {
            name: "rolbilgi",
            aliases: ["rb","rolbilgi"],
            Founder: true,
        });
    }
    async run(client, message, args, embed) {
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!role) return message.reply(`Bir rol belirtmen gerekli!`)
        if (role.members.size == 1 && role.members.first().user.bot && !role.editable) return message.reply(`Geçerli bir rol belirtmedin!`)
        let onlineMembers = message.guild.members.cache.filter(member => member.roles.cache.has(role.id) && member.presence && member.presence.status !== 'offline').size;
        let voiceMembers = message.guild.members.cache.filter(member => member.roles.cache.has(role.id) && member.voice.channel).size;

        embed.setDescription(`
        ${role.toString()} ( \`${role.id}\` ) rolüne ait bilgiler :
\`>\` **Role sahip kişiler :** \`${role.members.size}\`
\`>\` **Role sahip aktif kişiler :** \`${!onlineMembers ? 0 : onlineMembers}\`
 \`>\` **Role sahip sesteki kişiler :** \`${!voiceMembers ? 0 : voiceMembers}\`
${role.members.size < 10 && role.members.size ? `\`>\` **Role sahip kişilerin listesi :**\n${role.members.map(member => member.toString()).join(' , ')}` : !role.members.size ? '' : `\`>\` **Role sahip kişilerin listesini görmek için sayfayı çevirin**`}   
        `)

        message.reply({ embeds: [embed] }).then(async msg => {
            if (!role.members.size || role.members.size < 10) return;

            let currentPage = 0;
            let pageArray = role.members.array();
            let pages = pageArray.chunk(10);
            let reactions = ['◀', '❌', '▶'];
            for (let reaction of reactions) await msg.react(reaction);

            const filter = (reaction, user) => { return reactions.some(emoji => emoji == reaction.emoji.name) && user.id === message.author.id }
            const collector = msg.createReactionCollector({ filter, time: 30000 })
            collector.on('collect', async (reaction, user) => {


                if (reaction.emoji.name === "▶") {

                    await reaction.users.remove(message.author.id).catch(err => { });
                    if (currentPage == pages.length) return;
                    currentPage++;
                    if (msg) msg.edit({ embeds: [embed.setTitle(`Roldeki Üyelerin Listesi :`).setDescription(`${pages[currentPage - 1].map((member, index) => { return `\`${index + 1}.\` ${member.toString()} ( \`${member.id}\` )`; }).join('\n')}`).setFooter(`• Sayfa : ${currentPage}`)] });

                } else if (reaction.emoji.name === "❌") {
                    if (msg) msg.delete().catch(err => { });
                    if (message) return message.delete().catch(err => { });

                } else if (reaction.emoji.name === "◀") {

                    await reaction.users.remove(message.author.id).catch(err => { });
                    if (currentPage == 0) return;
                    currentPage--;
                    if (currentPage == 0 && msg) msg.edit({ embeds: [embed.setTitle("").setDescription(description).setFooter(`bwratxd&arislesnar`)] });
                    else if (currentPage > 0 && msg) msg.edit({ embeds: [embed.setTitle(`Roldeki Üyelerin Listesi :`).setDescription(`${pages[currentPage - 1].map((member, index) => { return `\`${index + 1}.\` ${member.toString()} ( \`${member.id}\` )`; }).join('\n')}`).setFooter(`• Sayfa : ${currentPage}`)] }).catch(err => { });

                }
            })
        })
    }
};

module.exports = Rolbilgi