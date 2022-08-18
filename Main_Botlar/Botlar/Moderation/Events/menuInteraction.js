const { Custom } = require("../../../Helpers/Schemas")
class MenuInteraction {
    Event = "interactionCreate"
    async run(interaction) {
        try {
            let Database = await Custom.find({})
            if (Database && Database.length >= 1) {
                for (let index = 0; index < Database.length; index++) {
                    let menu = interaction.customId
                    const member = await client.guilds.cache.get(interaction.guild.id).members.fetch(interaction.member.user.id)
                    if (!member) return;
                    let Data = Database[index]
                    if (Data.Secret == menu) {
                        let customMap = new Map();
                        Data.Roles.forEach(r => customMap.set(r, r));
                        let roles = Data.Roles;
                        var role = [];
                        for (let index = 0; index < interaction.values.length; index++) {
                            let ids = interaction.values[index];
                            let den = customMap.get(ids);
                            role.push(den);
                        }
                        if (interaction.values[0] === "rolsil") {
                            await member.roles.remove(roles);
                        } else {
                            if (!interaction.values.length) {
                                await member.roles.remove(roles).catch(err => { });
                            } else {
                                await member.roles.remove(roles).catch(err => { });
                                await member.roles.add(role).catch(err => { });
                            }
                        }
                        await interaction.reply({ content: "Merhaba! Rollerinizi başarılı bir şekilde güncelledim!.", ephemeral: true });
                    }
                }
            }
        } catch (error) { 
            client.logger.error(`Etkinlik: ${module.exports.name} \nHata: ` + error) 
        }
       
    }
}

module.exports = MenuInteraction