const { ariscik } = require('../../../Helpers/Schemas')
class ButtonSystem {
  Event = "interactionCreate"
  async run(interaction, args) {
    try {
        const aris = await ariscik.findOne({ guildID: config.guildID })

        if (interaction.customId === "etkinlikrol") { if (interaction.member.roles.cache.has(aris.etkinlikRole)) { interaction.member.roles.remove(aris.etkinlikRole); interaction.reply({ content: `Tebrikler ${interaction.member}! Üzerinizden <@&${aris.etkinlikRole}> rolü alındı!`, ephemeral: true }) } else { interaction.member.roles.add(aris.etkinlikRole); interaction.reply({ content: `Tebrikler ${interaction.member}! Üzerinize <@&${aris.etkinlikRole}> rolü verildi!`, ephemeral: true }) } }
    
        if (interaction.customId === "cekilisrol") { if (interaction.member.roles.cache.has(aris.cekilisRole)) { interaction.member.roles.remove(aris.cekilisRole); interaction.reply({ content: `Tebrikler ${interaction.member}! Üzerinizden <@&${aris.cekilisRole}> rolü alındı!`, ephemeral: true }) } else { interaction.member.roles.add(aris.cekilisRole); interaction.reply({ content: `Tebrikler ${interaction.member}! Üzerinize <@&${aris.cekilisRole}> rolü verildi!`, ephemeral: true }) } }
    
    
    } catch (e) {
        client.logger.error(`Etkinlik: ${module.exports.name} \nHata: ` + e)
    }
}
}

module.exports = ButtonSystem