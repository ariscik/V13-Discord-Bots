class Reboot extends Command {
    constructor(client) {
        super(client, {
            name: "reboot",
            aliases: ["reboot"],
            Aris: true,
        });
    }
    async run(client, message, args) {
        if (!args[0]) {
            await message.reply(`Bot yeniden başlatılıyor..`)
            process.exit(0)
        }
        else {
            let komutAd = args[0].toLowerCase()
            let cmd = client.commands.get(komutAd) || client.commands.get(client.aliases.get(komutAd));
            if (!cmd) {
                return message.reply(`\`${komutAd}\` isminde bir komut bulunamadı!`)
            }
            await client.unloadCommand(cmd.config.location, cmd.info.name);
            await client.loadCommand(cmd.config.location, cmd.info.name);
            message.channel.send(`\`${cmd.info.name.charAt(0).replace('i', "İ").toUpperCase() + cmd.info.name.slice(1)}\` isimli komut yeniden başlatılıyor...`)
        }

    }
}

module.exports = Reboot