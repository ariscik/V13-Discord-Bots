const { ariscik, talentPerms } = require('../../../../Helpers/Schemas')
class TalentPerm extends Command {
    constructor(client) {
        super(client, {
            name: "tp",
            aliases: ["talentperm", "özelkomut"],
            Founder: true
        });
    }
    async run(client, message, args, embed) {
        if (!args[0]) return message.channel.send({ embeds: [embed.setDescription(`**UYARI :** Bir argüman belirtmelisin!`)] }).sil(5)
        if (args[0] === "oluştur" || args[0] === "ekle") {
            let komutAd = args[1];
            if (!komutAd) return message.reply({ embeds: [embed.setDescription(`**UYARI : ** Bir komut adı belirlemelisin!`)] }).sil(10); let args2 = args.splice(2).join(" ").split(" - "); if (!args2) return message.channel.send({ embeds: [embed.setDescription(`Bir rol ve yetkili rolü belirlemelisin! \`Verilecek Rol - Yetkili Rol\``)] }).sil(5); let roller = args2[0].split(" ").map(rol => message.guild.roles.cache.get(rol.replace("<@&", "").replace(">", ""))); let yetkiliRol = args2[1].split(" ").map(rol => message.guild.roles.cache.get(rol.replace("<@&", "").replace(">", "")));
            let talents = await talentPerms.findOne({ guildID: message.guild.id, komutAd: komutAd });
            if (talents) return message.reply({ embeds: [embed.setDescription(`**UYARI : ** Bu isimde bir komut zaten mevcut!`)] }).sil(10)
            let newData = talentPerms({ guildID: message.guild.id, komutAd: komutAd, verilcekRol: roller, YetkiliRol: yetkiliRol }); newData.save();
            message.channel.send({ embeds: [embed.setDescription(`${emojis.onay} \`${komutAd}\` adlı komut başarılı bir şekilde oluşturuldu!\n\nVerilecek Rol: ${roller}\nKomut İzni Olan Roller: ${yetkiliRol}`)] });
        } else if (args[0] === "list" || args[0] === "list" || args[0] === "incele" || args[0] === "bilgi") {
            let data = await talentPerms.find({}); let data2 = await talentPerms.findOne({ guildID: message.guild.id, komutAd: args[1] });
            if (!data2) return message.reply({ embeds: [embed.setDescription(`**UYARI : ** Lütfen bir komut adı girerek tekrar deneyiniz.\n\n(Komutlar: \`${data.map(x => x.komutAd).join(" - ")}\`) `)] }).sil(10)
            message.channel.send({ embeds: [embed.setDescription(`Komut adı : ${data2.komutAd}\nRol : ${data2.verilcekRol.length > 0 ? data2.verilcekRol.map(x => `<@&${x}>`) : "Her hangi bir rol yok."}\nYetkililer : ${data2.YetkiliRol.length > 0 ? data2.YetkiliRol.map(x => `<@&${x}>`) : "Her hangi bir rol yok."}`)] })
        } else if (args[0] === "sil" || args[0] === "kaldır") {
            let data2 = await talentPerms.findOne({ guildID: message.guild.id, komutAd: args[1] })
            if (!data2) return message.reply({ embeds: [embed.setDescription(`**UYARI : ** Hangi komutu silmek istiyorsun?`)] }).sil(20)
            await talentPerms.deleteOne({ guildID: message.guild.id, komutAd: args[1] })
            await message.channel.send(`${emojis.onay} \`${args[1]}\` isimli komut başarılı bir şekilde silindi!`).sil(20)
        }
    }
}

module.exports = TalentPerm