const { roleBackup, ariscik } = require("../../../Helpers/Schemas")
class Ready {
    Event = "ready"
    async run() {
        setInterval(async () => {
            const aris = await ariscik.findOne({ guildID: config.guildID })
            const channel = client.channels.cache.get(aris.botVoiceChannel);
            voice.joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
        }, 600 * 1000);
        RolKontrol()
        setInterval(() => {
            RolKontrol();
        }, 1000 * 60 * 60 * 1);
    }
}

async function RolKontrol() {
    const guild = client.guilds.cache.get(config.guildID);
    const roles = guild.roles.cache.filter(r => r.name !== "@everyone").array();
    for (let index = 0; index < roles.length; index++) {
        const role = roles[index];
        await roleBackup.findOne({ roleID: role.id }, async (err, data) => {
            if (!data) {
                const newData = new roleBackup({
                    roleID: role.id,
                    time: Date.now(),
                    members: role.members.map(m => m.id),
                });
                newData.save();
            } else {
                data.time = Date.now();
                data.members = role.members.map(m => m.id);
                data.save();
            };
        });
    }
    await roleBackup.find({}, (err, roles) => {
        roles.filter(r => !guild.roles.cache.has(r.roleID) && Date.now() - r.time > 1000 * 60 * 60 * 24 * 3).forEach(r => {
            r.remove()
        });
    });
};

module.exports = Ready;