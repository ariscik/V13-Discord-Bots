const { ariscik } = require("../../../../Helpers/Schemas")
class AutoScan extends Command {
    constructor(client) {
        super(client, {
            name: "autoscan",
            aliases: ["otokontrol","autocontrol"],
            Aris: true,
        });
    }
    async run(client, message, args, embed) {
        let manRole = message.guild.roles.cache.filter(x => x.name.toLocaleLowerCase().includes('homme')).map(x => x.id)[0] || undefined
        if (manRole !== undefined || manRole !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { manRoles: manRole } }, { upsert: true }).exec(); }
        
        let womanRole = message.guild.roles.cache.filter(x => x.name.toLocaleLowerCase().includes('femme')).map(x => x.id)[0] || undefined
        if (womanRole !== undefined || womanRole !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { womanRoles: womanRole } }, { upsert: true }).exec(); }
        
        let ban = message.guild.roles.cache.filter(x => x.name.toLocaleLowerCase().includes('ban')).map(x => x.id)[0] || undefined
        if (ban !== undefined || ban !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { banHammer: ban } }, { upsert: true }).exec(); }

        let mute = message.guild.roles.cache.filter(x => x.name.toLocaleLowerCase().includes('mute')).map(x => x.id)[0] || undefined
        if (mute !== undefined || mute !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { muteHammer: mute } }, { upsert: true }).exec();  }
        
        let vmute = message.guild.roles.cache.filter(x => x.name.toLocaleLowerCase().includes('voice')).map(x => x.id)[0] || undefined
        if (vmute !== undefined || vmute !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { vmuteHammer: vmute } }, { upsert: true }).exec();  }
        
        let clown = message.guild.roles.cache.filter(x => x.name.toLocaleLowerCase().includes('clown')).map(x => x.id)[0] || undefined
        if (clown !== undefined || clown !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { clownHammer: clown } }, { upsert: true }).exec();  }
        
        let move = message.guild.roles.cache.filter(x => x.name.toLocaleLowerCase().includes('move')).map(x => x.id)[0] || undefined
        if (move !== undefined || move !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { moveHammer: move } }, { upsert: true }).exec();  }
        
        let register = message.guild.roles.cache.filter(x => x.name.toLocaleLowerCase().includes('register') || x.name.toLocaleLowerCase().includes('command')).map(x => x.id)[0] || undefined
        if (register !== undefined || register !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { registerHammer: register } }, { upsert: true }).exec();  }
        
        let unreg = message.guild.roles.cache.filter(x => x.name.toLocaleLowerCase().includes('unregister') || x.name.toLocaleLowerCase().includes('plebs')).map(x => x.id)[0] || undefined
        if (unreg !== undefined || unreg !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { unregisterRole: unreg } }, { upsert: true }).exec();  }
        
        let tagr = message.guild.roles.cache.filter(x => x.name.toLocaleLowerCase().includes('tagges') || x.name.toLocaleLowerCase().includes('family')).map(x => x.id)[0] || undefined
        if (tagr !== undefined || tagr !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { tagRol: tagr } }, { upsert: true }).exec();  }
        
        let muted = message.guild.roles.cache.filter(x => x.name.toLocaleLowerCase().includes('muted')).map(x => x.id)[0] || undefined
        if (muted !== undefined || muted !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { mutedRole: muted } }, { upsert: true }).exec();  }
        
        let vmuted = message.guild.roles.cache.filter(x => x.name.toLocaleLowerCase().includes('voice muted')).map(x => x.id)[0] || undefined
        if (vmuted !== undefined || vmuted !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { vmutedRole: vmuted } }, { upsert: true }).exec();  }
        
        let cezali = message.guild.roles.cache.filter(x => x.name.toLocaleLowerCase().includes('jail') || x.name.toLocaleLowerCase().includes('karantina')).map(x => x.id)[0] || undefined
        if (cezali !== undefined || cezali !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { jailedRole: cezali } }, { upsert: true }).exec();  }
        
        let booster = message.guild.roles.cache.filter(x => x.name.toLocaleLowerCase().includes('rich') || x.name.toLocaleLowerCase().includes('booster')).map(x => x.id)[0] || undefined
        if (booster !== undefined || booster !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { boosterRole: booster } }, { upsert: true }).exec();  }
        
        let etkinlik = message.guild.roles.cache.filter(x => x.name.toLocaleLowerCase().includes('etkinlik')).map(x => x.id)[0] || undefined
        if (etkinlik !== undefined || etkinlik !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { etkinlikRole: etkinlik } }, { upsert: true }).exec();  }
        
        let cekilis = message.guild.roles.cache.filter(x => x.name.toLocaleLowerCase().includes('çekiliş')).map(x => x.id)[0] || undefined
        if (cekilis !== undefined || cekilis !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { cekilisRole: cekilis } }, { upsert: true }).exec();  }


        // ------------------------------------ KANAL AYARLAMALARI ------------------------------------ //

        let guard = message.guild.channels.cache.filter(x => x.name.toLocaleLowerCase().includes('guard')).map(x => x.id)[0] || undefined
        if (guard !== undefined || guard !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { guardLog: guard } }, { upsert: true }).exec();  }

        let banl = message.guild.channels.cache.filter(x => x.name.toLocaleLowerCase().includes('ban')).map(x => x.id)[0] || undefined
        if (banl !== undefined || banl !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { banLog: banl } }, { upsert: true }).exec();  }

        let jaill = message.guild.channels.cache.filter(x => x.name.toLocaleLowerCase().includes('jail')).map(x => x.id)[0] || undefined
        if (jaill !== undefined || jaill !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { jailLog: jaill } }, { upsert: true }).exec();  }

        let mutel = message.guild.channels.cache.filter(x => x.name.toLocaleLowerCase().includes('mute')).map(x => x.id)[0] || undefined
        if (mutel !== undefined || mutel !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { muteLog: mutel } }, { upsert: true }).exec();  }

        let tagl = message.guild.channels.cache.filter(x => x.name.toLocaleLowerCase().includes('tag')).map(x => x.id)[0] || undefined
        if (tagl !== undefined || tagl !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { tagLog: tagl } }, { upsert: true }).exec();  }

        let denetiml = message.guild.channels.cache.filter(x => x.name.toLocaleLowerCase().includes('denetim')).map(x => x.id)[0] || undefined
        if (denetiml !== undefined || denetiml !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { denetimLog: denetiml } }, { upsert: true }).exec();  }

        let mlog = message.guild.channels.cache.filter(x => x.name.toLocaleLowerCase().includes('message')).map(x => x.id)[0] || undefined
        if (mlog !== undefined || mlog !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { messageLog: mlog } }, { upsert: true }).exec();  }

        let vlog = message.guild.channels.cache.filter(x => x.name.toLocaleLowerCase().includes('voice')).map(x => x.id)[0] || undefined
        if (vlog !== undefined || vlog !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { voiceLog: vlog } }, { upsert: true }).exec();  }

        let invl = message.guild.channels.cache.filter(x => x.name.toLocaleLowerCase().includes('invite')).map(x => x.id)[0] || undefined
        if (invl !== undefined || invl !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { inviteLog: invl } }, { upsert: true }).exec();  }

        let roll = message.guild.channels.cache.filter(x => x.name.toLocaleLowerCase().includes('rol')).map(x => x.id)[0] || undefined
        if (roll !== undefined || roll !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { rolLog: roll } }, { upsert: true }).exec();  }

        let botv = message.guild.channels.cache.filter(x => x.name.toLocaleLowerCase().includes('</>')).map(x => x.id)[0] || undefined
        if (botv !== undefined || botv !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { botVoiceChannel: botv } }, { upsert: true }).exec();  }

        let clog = message.guild.channels.cache.filter(x => x.name.toLocaleLowerCase().includes('command')).map(x => x.id)[0] || undefined
        if (clog !== undefined || clog !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { commandsChannel: clog } }, { upsert: true }).exec();  }

        let wlog = message.guild.channels.cache.filter(x => x.name.toLocaleLowerCase().includes('welcome')).map(x => x.id)[0] || undefined
        if (wlog !== undefined || wlog !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { welcomeChanel: wlog } }, { upsert: true }).exec();  }

        let gchat = message.guild.channels.cache.filter(x => x.name.toLocaleLowerCase().includes('genel')).map(x => x.id)[0] || undefined
        if (gchat !== undefined || gchat !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { genelChat: gchat } }, { upsert: true }).exec();  }

        let eclog = message.guild.channels.cache.filter(x => x.name.toLocaleLowerCase().includes('rol-alma')).map(x => x.id)[0] || undefined
        if (eclog !== undefined || eclog !== null) { await ariscik.findOneAndUpdate({ guildID: config.guildID }, { $set: { ecChannel: eclog } }, { upsert: true }).exec();  }

        message.react(emojis.onay)
        message.channel.send({ embeds: [embed.setDescription(`Merhaba ${message.author}! Oto rol ve kanal kontrolü tamamlandı!\n\n \` ❯ \` **.setup** komutu ile kontrol edebilir ve değişiklik yapabilirsin! ${emojis.onay}`)]})
    }
}

module.exports = AutoScan