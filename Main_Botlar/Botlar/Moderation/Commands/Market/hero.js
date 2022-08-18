const { ariscik, hero } = require('../../../../Helpers/Schemas')
class Hero extends Command {
    constructor(client) {
        super(client, {
            name: "heromarket",
            aliases: ["hero", "kahraman", "kahramanmarket", "kahramanlarım", "herolarım"],
            cooldown: 20
        });
    }
    async run(client, message, args, embed) {
        const aris = await ariscik.findOne({ guildID: message.guild.id })
        const heroData = await hero.findOne({ guildID: message.guild.id, userID: message.author.id })
        if (!heroData) {
            const secim = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu().setPlaceholder('Takımını Kur!').setCustomId('takimkur').addOptions([{ label: "Takımını Kur!", description: "İlk Heronu Satın Al!!", value: "ilkherom" }]));
            let heros = await message.channel.send({
                embeds: [embed.setThumbnail("https://cdn.discordapp.com/attachments/872871186772676688/957686717807230976/f203e67982c3cb53e9041243669d8a59.png").setDescription(`
Merhaba ${message.author.id}! Hero mağazına hoş geldin! 

${emojis.nokta} Şu anda hiç bir heron bulunmamakta. Bu yüzden her hangi bir faaliyet gösteremezsin! 

${emojis.star} Lütfen takımını oluşturmak için aşağıdaki heroyu seç!
            `)], components: [secim]
            })
            heros.awaitMessageComponent({ filter: (component) => component.user.id === message.author.id }).then(async (interaction) => {
                if (interaction.values[0] == "ilkherom") {
                    interaction.deferUpdate();
                    await hero.findOneAndUpdate({ guildID: message.guild.id, userID: interaction.user.id }, { $inc: { NumberHero: 1, power: 10 } }, { upsert: true })
                    await hero.findOneAndUpdate({ guildID: message.guild.id, userID: interaction.user.id },  { JuanPablo: false, JoseGacha: false, Pacho: false, Posion: false, Quica: false, Gaviria: false, Pablo: false } ) 
                    if (heros) heros.edit({
                        embeds: [embed.setThumbnail("https://cdn.discordapp.com/attachments/872871186772676688/957686717807230976/f203e67982c3cb53e9041243669d8a59.png").setDescription(`
${emojis.onay} Tebrikler! İlk heronu alarak takımını kurdun. 

${emojis.nokta} Herolar \`ACoin\` sayesinde alınmaktadır. ACoin kazanmak için <#${aris.genelChat}> kanalında sohbet edebilirsin!
                        `)], components: []
                    })
                }
            })
        } else {
            const heromarket = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu().setPlaceholder('Hero Satın Al!').setCustomId('herosatinal').addOptions([{ label: "Pablo Emilio Escobar Gaviria", description: "+500 takım gücü!", value: "pabloescobar" }, { label: "Gustavo Gaviria", description: "+300 takım gücü!", value: "gaviria" }, { label: "La Quica", description: "+250 takım gücü!", value: "quica" }, { label: "Poison", description: "+200 takım gücü", value: "posion" }, { label: "Pacho Herrera", description: "+150 takım gücü!", value: "pacho" }, { label: "Jose Rodriguez Gacha", description: "+100 takım gücü!", value: "josegacha" }, { label: "Juan Pablo Escobar", description: "+50 takım gücü!", value: "juanpablo" }]));
            const heromarket2 = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu().setPlaceholder('Hero Satın Al!').setCustomId('herosatinal').addOptions([{ label: "Pablo Emilio Escobar Gaviria", description: "+500 takım gücü!", value: "pabloescobar" }, { label: "Gustavo Gaviria", description: "+300 takım gücü!", value: "gaviria" }, { label: "La Quica", description: "+250 takım gücü!", value: "quica" }, { label: "Poison", description: "+200 takım gücü", value: "posion" }, { label: "Pacho Herrera", description: "+150 takım gücü!", value: "pacho" }, { label: "Jose Rodriguez Gacha", description: "+100 takım gücü!", value: "josegacha" }]));
            const heromarket3 = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu().setPlaceholder('Hero Satın Al!').setCustomId('herosatinal').addOptions([{ label: "Pablo Emilio Escobar Gaviria", description: "+500 takım gücü!", value: "pabloescobar" }, { label: "Gustavo Gaviria", description: "+300 takım gücü!", value: "gaviria" }, { label: "La Quica", description: "+250 takım gücü!", value: "quica" }, { label: "Poison", description: "+200 takım gücü", value: "posion" }, { label: "Pacho Herrera", description: "+150 takım gücü!", value: "pacho" }]));
            const heromarket4 = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu().setPlaceholder('Hero Satın Al!').setCustomId('herosatinal').addOptions([{ label: "Pablo Emilio Escobar Gaviria", description: "+500 takım gücü!", value: "pabloescobar" }, { label: "Gustavo Gaviria", description: "+300 takım gücü!", value: "gaviria" }, { label: "La Quica", description: "+250 takım gücü!", value: "quica" }, { label: "Poison", description: "+200 takım gücü", value: "posion" }]));
            const heromarket5 = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu().setPlaceholder('Hero Satın Al!').setCustomId('herosatinal').addOptions([{ label: "Pablo Emilio Escobar Gaviria", description: "+500 takım gücü!", value: "pabloescobar" }, { label: "Gustavo Gaviria", description: "+300 takım gücü!", value: "gaviria" }, { label: "La Quica", description: "+250 takım gücü!", value: "quica" }]));
            const heromarket6 = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu().setPlaceholder('Hero Satın Al!').setCustomId('herosatinal').addOptions([{ label: "Pablo Emilio Escobar Gaviria", description: "+500 takım gücü!", value: "pabloescobar" }, { label: "Gustavo Gaviria", description: "+300 takım gücü!", value: "gaviria" }]));
            const heromarket7 = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu().setPlaceholder('Hero Satın Al!').setCustomId('herosatinal').addOptions([{ label: "Pablo Emilio Escobar Gaviria", description: "+500 takım gücü!", value: "pabloescobar" }]));

            if (!heroData.JuanPablo && !heroData.JoseGacha && !heroData.Pacho && !heroData.Posion && !heroData.Quica && !heroData.Gaviria && !heroData.Pablo && heroData.JuanPablo == false && heroData.JoseGacha == false && heroData.Pacho == false && heroData.Posion == false && heroData.Quica == false && heroData.Gaviria == false && heroData.Pablo == false) {
                let heros2 = await message.channel.send({
                    embeds: [embed.setThumbnail("https://cdn.discordapp.com/attachments/872871186772676688/957686717807230976/f203e67982c3cb53e9041243669d8a59.png").setDescription(`
Merhaba ${message.author}! 
    
$ Şu anda toplam \`${heroData.NumberHero}\` adet heron var!
    
$ Toplam \`ACoin\` miktarın : \`${heroData.ACoin}\`
    
$ Toplam takım gücün : \`${heroData.power}\`
    
${emojis.nokta} Hero satın almak için aşağıdaki menüyü kullanabilirsin! Unutma sadece \`ACoin\`'inin yettiği heroları satın alabilirsin!
                    `)], components: [heromarket]
                })
                heros2.awaitMessageComponent({ filter: (component) => component.user.id === message.author.id }).then(async (interaction) => {
                    if (interaction.values[0] == "juanpablo") {
                        await hero.findOneAndUpdate({ guildID: message.guild.id, userID: interaction.user.id }, { JuanPablo: true })
                        await hero.findOneAndUpdate({ guildID: message.guild.id, userID: interaction.user.id }, { $inc: { NumberHero: 1, power: 50 } }, { upsert: true })
                        if (heros2) heros2.edit({
                            embeds: [embed.setThumbnail("https://cdn.discordapp.com/attachments/872871186772676688/957686717807230976/f203e67982c3cb53e9041243669d8a59.png").setDescription(`
${emojis.onay} Tebrikler! \`Juan Pablo\` isimli heroyu takımına aldın. Bu hero sana \`+50\` takım gücü kazandırdı! 
    
${emojis.nokta} Herolar \`ACoin\` sayesinde alınmaktadır. ACoin kazanmak için <#${aris.genelChat}> kanalında sohbet edebilirsin!
    
${emojis.nokta} Toplam heron \`${heroData.NumberHero + 1}\` ve toplam takım gücün \`${heroData.power + 50}\` oldu!
                            `)], components: []
                        })
                    }
                })
            }
            if (heroData.JuanPablo == true) {
                let heros2 = await message.channel.send({
                    embeds: [embed.setThumbnail("https://cdn.discordapp.com/attachments/872871186772676688/957686717807230976/f203e67982c3cb53e9041243669d8a59.png").setDescription(`
Merhaba ${message.author}! 
    
$ Şu anda toplam \`${heroData.NumberHero}\` adet heron var!
    
$ Toplam \`ACoin\` miktarın : \`${heroData.ACoin}\`
    
$ Toplam takım gücün : \`${heroData.power}\`
    
${emojis.nokta} Hero satın almak için aşağıdaki menüyü kullanabilirsin! Unutma sadece \`ACoin\`'inin yettiği heroları satın alabilirsin!
                    `)], components: [heromarket2]
                })
                heros2.awaitMessageComponent({ filter: (component) => component.user.id === message.author.id }).then(async (interaction) => {
                    if (interaction.values[0] == "juanpablo") {
                        await hero.findOneAndUpdate({ guildID: message.guild.id, userID: interaction.user.id }, { JuanPablo: true })
                        await hero.findOneAndUpdate({ guildID: message.guild.id, userID: interaction.user.id }, { $inc: { NumberHero: 1, power: 50 } }, { upsert: true })
                        if (heros2) heros2.edit({
                            embeds: [embed.setThumbnail("https://cdn.discordapp.com/attachments/872871186772676688/957686717807230976/f203e67982c3cb53e9041243669d8a59.png").setDescription(`
${emojis.onay} Tebrikler! \`Juan Pablo\` isimli heroyu takımına aldın. Bu hero sana \`+50\` takım gücü kazandırdı! 
    
${emojis.nokta} Herolar \`ACoin\` sayesinde alınmaktadır. ACoin kazanmak için <#${aris.genelChat}> kanalında sohbet edebilirsin!
    
${emojis.nokta} Toplam heron \`${heroData.NumberHero + 1}\` ve toplam takım gücün \`${heroData.power + 50}\` oldu!
                            `)], components: []
                        })
                    }
                })
            }


        }



    }
}

module.exports = Hero