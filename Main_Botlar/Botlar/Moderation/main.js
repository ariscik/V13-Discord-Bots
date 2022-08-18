const { Intents, Client, Collection} = require("discord.js")
const { Aris } = require("./Aris")
const config = require("../../Settings/config.json")
const client = global.client = new Aris({
  fetchAllMembers: true,
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
  ],
  presence: {
    activities: [config.durum],
    status: config.status
  },
});
client.invites = new Collection();
client.spam = new Map();
require("../../Helpers/Utils")(client)
require("../../Helpers/Mongo").Mongoose.Connect()
client.handler.events(client, '/Events/', __dirname);
Aris.init();
client
  .on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
  .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
  .on("error", e => client.logger.error(e))
  .on("warn", info => client.logger.warn(info));
process.on("uncaughtException", err => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Beklenmedik yakalanamayan hata: ", errorMsg);
});
const tables = require('tables-discord');
tables(client, {
    console: true,
});
process.on("unhandledRejection", err => {
  console.error("Promise Hatası: ", err);
});

client.on("guildCreate", async (guild) => {
  guild.invites.fetch().then((guildInvites) => {
    const cacheInvites = new Collection();
    guildInvites.map((inv) => {
      cacheInvites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter });
    });
    client.invites.set(guild.id, cacheInvites);
  });
})

client.on("ready", async() => {
  require("./dash")
  client.logger.log(`Web panel sistemi aktif ediliyor!`, "log")
})

const logs = require('discord-logs');
logs(client);
client.on("guildMemberOffline", async (member, oldStatus) => {
  const Discord = require("discord.js")
  const { preUser, ariscik } = require("../../Helpers/Schemas")
  const aris = await ariscik.findOne({ guildID: config.guildID })
  const roles = member.roles.cache.filter((e) => ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_CHANNELS", "MANAGE_WEBHOOKS"].some((a) => e.permissions.has(a)))
  if (member.manageable && !member.user.bot && member.guild.id === config.guildID && ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_CHANNELS", "MANAGE_WEBHOOKS"].some((a) => member.permissions.has(a))) {
    await preUser.findOneAndUpdate({ guildID: config.guildID, userID: member.user.id }, { $set: { roles: roles.map((e) => e.id) } }, { upsert: true });
    await member.roles.remove(roles.map((e) => e.id), `Offline olduğu için rolleri çekildi!`).catch(err => console.log(err))
    client.channels.cache.get(aris.guardLog).send({
      embeds: [new Discord.MessageEmbed().setTitle("Yönetici Çevrimdışı Oldu!").setFooter(`Developed By Aris Lesnar.`).setTimestamp().setThumbnail(member.user.avatarURL())
        .setDescription(`\n
${member} kişisi **Çevrimdışı** duruma geçtiği için yetkileri çekildi! 
\n\n
${emojis.iptal} Çekilen yetkiler \`>\` ${roles.map(e => `<@&${e.id}>`)} 
    `)]
    })
  }
});
client.on("guildMemberOnline", async (member, newStatus) => {
  const Discord = require("discord.js")
  const { preUser, ariscik } = require("../../Helpers/Schemas")
  const aris = await ariscik.findOne({ guildID: config.guildID })
  const data = await preUser.findOne({ guildID: config.guildID, userID: member.user.id });
  if (!data) return
  if (data.roles || data.roles.length) {
    await data.roles.map(e => member.roles.add(e, "Online olduğu için yetkileri verildi"))
    await preUser.findOneAndDelete({ guildID: config.guildID, userID: member.user.id });
    client.channels.cache.get(aris.guardLog).send({
      embeds: [new Discord.MessageEmbed().setTitle("Yönetici Çevrimiçi Oldu!").setFooter(`Developed By Aris Lesnar.`).setTimestamp().setThumbnail(member.user.avatarURL())
        .setDescription(`\n
${member} kişisi **Çevrimiçi** duruma geçtiği için yetkileri geri verildi! 
\n\n
${emojis.onay} Verilen yetkiler \`>\` ${data.roles.map(e => `<@&${e}>`)} 
        `)]
    })
  }
});
