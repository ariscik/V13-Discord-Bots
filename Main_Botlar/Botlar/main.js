const { Client, Intents } = require('discord.js');
const config = require("../Settings/config.json");
let Bots = global.bots = []
module.exports = Bots
config.Tokens.forEach(token => {
  let clients = new Client({
    fetchAllMembers: true,
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_PRESENCES,
    ],
    presence: {
      activities: [config.durum],
      status: "invisible"
    },
  });
  clients.on("ready", () => {
    Bots.push(clients);
  })
  async function urlSpam() {
    const aris = await ariscik.findOne({ guildID: config.guildID }); const request = require('request'); const guild = clients.guilds.cache.get(config.guildID)
    if (!guild) return; if (guild.vanityURLCode && (guild.vanityURLCode == config.guildURL)) return;
    clients.channels.cache.get(aris.guardLog).send({ content: `@everyone`, embeds: [new MessageEmbed().setDescription(`URL Değiştirildi. Kontrolüme Takıldı ve Bende Tekrardan URL'yi geri aldım.`)]})
    request({ url: `https://discord.com/api/v6/guilds/${guild.id}/vanity-url`, body: { code: config.guildURL }, json: true, method: 'PATCH', headers: { "Authorization": `Bot ${token}` } }, (err, res, body) => { if (err) { console.log("Malesef Fonksiyon Çalışmadı...") } }); 
}
const { ariscik } = require("../Helpers/Schemas")
clients.on("ready", async () => { const aris = await ariscik.findOne({ guildID: config.guildID }); if(aris.urlGuard === true) { setInterval(() => {  urlSpam(); }, 1000 * 5); } })

  clients.login(token).then(e => {
  }).catch(e => {
    console.log(`${token.substring(Math.floor(token.length / 2))} giriş yapamadı.`);
  });
});
