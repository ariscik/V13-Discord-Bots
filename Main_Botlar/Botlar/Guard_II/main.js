const { Client, Intents } = require('discord.js');//oç ferhat
const FileSync = require('lowdb/adapters/FileSync');
const config = require("../../Settings/config.json")
const client = global.client = new Client({
  fetchAllMembers: true,
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_INVITES,
  ],
  presence: {
    activities: [config.durum],
    status: config.status
  },
});
client.adapters = file => new FileSync(`../../Settings/${file}.json`);
require("../../Helpers/Utils")(client)
require("../../Helpers/Mongo").Mongoose.Connect()
client.handler.events(client, '/Events', __dirname);

client.login(config.Guard_II).then(() =>
  client.logger.log(`${client.user.tag} olarak giriş yapıldı!`)).catch((error) =>
    client.logger.error("Discord API Botun tokenini doğrulayamadı." + error));
client
  .on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
  .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
  .on("error", e => client.logger.error(e))
  .on("warn", info => client.logger.warn(info));
process.on("uncaughtException", err => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Beklenmedik yakalanamayan hata: ", errorMsg);
});
process.on("unhandledRejection", err => {
  console.error("Promise Hatası: ", err);
});