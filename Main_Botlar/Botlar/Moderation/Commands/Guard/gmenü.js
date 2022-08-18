const {  ariscik, roleBackup, channelBackup } = require("../../../../Helpers/Schemas")
const Backup = require("../../../../Helpers/Backup")
class Gmenu extends Command {
    constructor(client) {
        super(client, {
            name: "gmenü",
            aliases: ["gmenu"],
            Founder: true,
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: config.guildID })
        var rolkontrol = new Discord.MessageButton().setCustomId('rolkontrol').setLabel(`Rolleri Kontrol Et!`).setStyle('PRIMARY'); var kanalkontrol = new Discord.MessageButton().setCustomId('kanalkontrol').setLabel(`Kanalları Kontrol Et`).setStyle('PRIMARY'); var backupal = new Discord.MessageButton().setCustomId('backupal').setLabel(`Backup Al!`).setStyle('DANGER'); var backupal2 = new Discord.MessageButton().setCustomId('backupal').setLabel(`Backup Alınıyor!`).setStyle('DANGER').setDisabled(true);
        const row = new Discord.MessageActionRow().addComponents([ rolkontrol, kanalkontrol, backupal])
        const row2 = new Discord.MessageActionRow().addComponents([ rolkontrol, kanalkontrol, backupal2])
        const menu = await message.channel.send({ content: `Aşağıdaki menüden uygun işlemleri yapabilirsin!`, components: [row] })
        var filter = (button) => button.user.id === message.author.id;
        const collector = menu.createMessageComponentCollector({ filter })
        collector.on('collect', async (button, user) => {
            if (button.customId === "backupal") {
                await button.deferUpdate();
                await button.editReply({ content: 'Backup alınmaya başlandı!', components: [row2] });
                await Backup.RoleBackup()
                await Backup.channelBackup().then(async e => {
                    if (menu) await menu.edit({ content: `Aşağıdaki menüden uygun işlemleri yapabilirsin!`, components: [row] })
                })
            }
            if (button.customId === "rolkontrol") {
                gMenuRolKur();
                button.reply({ content: `Merhaba ${button.user}! Rol kontrolleri yapılıyor. Eksik olanlar açılıp gerekli işlemler yapılacak!` })
            }
            if (button.customId === "kanalkontrol") {
                gMenuKanalKur();
                button.reply({ content: `Merhaba ${button.user}! Kanal kontrolleri yapılıyor. Eksik olanlar açılıp gerekli işlemler yapılacak!` })
            }
        })


    }
};

async function gMenuRolKur() {
    const roles = await roleBackup.find();
    const guildses = client.guilds.cache.get(config.guildID);
    const deletedRoles = roles.filter(r => !guildses.roles.cache.has(r.roleID));
    deletedRoles.forEach(async (deletedRole) => {
        const newRole = await guildses.roles.create({
            name: deletedRole.name,
            color: deletedRole.color,
            hoist: deletedRole.hoist,
            position: deletedRole.position,
            permissions: deletedRole.permissions,
            mentionable: deletedRole.mentionable,
        });

        const Bots = global.bots.filter(e => !e.idle)
        let aris = await ariscik.findOne({ guildID: config.guildID })
        roleBackup.findOne({ roleID: deletedRole.roleID }, async (err, data) => {
            const channelPerm = data.channelOverwrites.filter(e => client.guilds.cache.get(config.guildID).channels.cache.get(e.id))
            for await (const perm of channelPerm) {
                const bott = Bots[1]
                const guild2 = bott.guilds.cache.get(config.guildID)
                let kanal = guild2.channels.cache.get(perm.id);
                if (!kanal) return;
                let newPerm = {};
                perm.allow.forEach(p => {
                    newPerm[p] = true;
                });
                perm.deny.forEach(p => {
                    newPerm[p] = false;
                });
                kanal.permissionOverwrites.create(newRole, newPerm).catch(error => console.log(error));
            }
            for (let index = 0; index < Bots.length; index++) {
                const bot = Bots[index];
                const guild = bot.guilds.cache.get(config.guildID);
                const members = deletedRoles.map((r) => r.members).reduce((a, b) => a.concat(b))
                if (members.length <= 0) {
                    console.log(`[${deletedRole.roleID}] Olayında kayıtlı üye olmadığından veya rol üyelerine dağıtıldığından dolayı rol dağıtımı gerçekleştirmedim.`);
                    if (aris.guardLog) client.channels.cache.get(aris.guardLog).send(`[${deletedRole.roleID}] rolünün datasında üye verisi bulunamadığı veya üyelere zaten dağıtıldığı için dağıtım işlemi yapılamadı!`)
                    break;
                }
                members.forEach(async (id, i) => {
                    const roles = deletedRoles.filter((role) => role.members.includes(id)).map((role) => role.id);
                    const member = guild.members.cache.get(id);
                    if (member) await member.roles.add(roles.filter((role) => !member.roles.cache.has(role)));
                })
                for await (const user of members) {
                    const member = guild.members.cache.get(user)
                    member.roles.add(newRole.id)
                }
            }
        })
    })
}

async function gMenuKanalKur() {
    const guildses = client.guilds.cache.get(config.guildID);
    const text = await channelBackup.find();
    const deletedTextChannels = text.filter(r => !guildses.channels.cache.has(r.channelID));
    deletedTextChannels.forEach(async (deletedChannels) => {
            const newChannel = await guildses.channels.create(deletedChannels.name, { type: deletedChannels.type, topic: deletedChannels.topic, bitrate: deletedChannels.bitrate, nsfw: deletedChannels.nsfw, parent: deletedChannels.parent, position: deletedChannels.position + 1, permissionOverwrites: deletedChannels.overwrites, rateLimitPerUser: deletedChannels.rateLimitPerUser, userLimit: deletedChannels.userLimit });
            if (newChannel) newChannel.setParent(deletedChannels.parentID, { lockPermissions: false });
            if (newChannel.type === 'GUILD_CATEGORY') {

                for (const parentChannel of deletedTextChannels.filter((channel) => channel.parent === deletedChannels.channelID)) {
                    parentChannel.parent = newChannel.id;
                }
                await channelBackup.updateMany({ parentID: deletedChannels.channelID }, { parentID: newChannel.id });
                const categorys = text.filter((channel) => channel.parentID === deletedChannels.channelID);
                for (const parentChannel of categorys) {
                    const channel = guildses.channels.cache.get(parentChannel.channelID);
                    if (channel) await channel.setParent(newChannel.id, { lockPermissions: false });
                }                
                }
        }) 
    }

module.exports = Gmenu