const fetch = require("node-fetch");
const allowedFormats = ["webp", "png", "jpg", "jpeg", "gif"];
const allowedSizes = Array.from({ length: 9 }, (e, i) => 2 ** (i + 4));
const low = require("lowdb")
const moment = require("moment");
require("moment-duration-format");
module.exports = {
  async ytKapat(guildID) {
    const { permis } = require("./Schemas")
    let arr = [];
    const yetkiPermleri = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_EMOJIS_AND_STICKERS", "MANAGE_WEBHOOKS"]
    const guild = client.guilds.cache.get(guildID)
    permis.deleteMany()
    guild.roles.cache.filter(rol => rol.editable).filter(rol => yetkiPermleri.some(yetki => rol.permissions.has(yetki))).forEach(async (rol) => { 
      arr.push({ rol: rol.id, perm: rol.permissions.bitfield.toString().replace('n', '') }); 
      permis.findOne({ guildID: config.guildID }, async (err, res) => { 
        let newData = new permis({ guildID: config.guildID, roller: arr }); 
        newData.save(); 
      }); 
      rol.setPermissions(0n) 
    });
  },

  async guvenli(kisiID) { const { ariscik } = require("./Schemas"); const whiteList = await ariscik.findOne({ guildID: config.guildID }); let uye = client.users.cache.get(kisiID); let guvenliler = whiteList.WhiteListMembers || []; let guvenliBotlar = config.bots || []; if (uye.id === client.user.id || config.root.includes(uye.id) || uye.id === config.guildID.ownerId || guvenliler.some(g => g.includes(uye.id)) || guvenliBotlar.some(g => g.includes(uye.id))) return true; else return false; },
  
  checkDays(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    return days + (days == 1 ? " gün" : " gün") + " önce";
  },
  sleep(ms) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + ms);
  },
  async getBanner(userId, {
    format,
    size,
    dynamic
  } = {}) {
    async function createBannerURL(userId, banner, format, size, dynamic) {
      if (dynamic) format = banner.startsWith("a_") ? "gif" : format;
      return `https://cdn.discordapp.com/banners/${userId}/${banner}.${format}${parseInt(size) ? `?size=${parseInt(size)}` : ''}`
    }
    if (format && !allowedFormats.includes(format)) throw new SyntaxError("Please specify an available format.");
    if (size && (!allowedSizes.includes(parseInt(size)) || isNaN(parseInt(size)))) throw new SyntaxError("Please specify an avaible size.");
    if (dynamic && typeof dynamic !== "boolean") throw new SyntaxError("Dynamic option must be Boolean.")
    let Data = ""
    try {
      await fetch(`https://discord.com/api/v9/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bot ${this.client.token}`
        }
      }).then(res => res.json())
        .then(user => {
          if (user.code == 50035) throw new SyntaxError("User not found.")
          if (user.banner !== null) Data = createBannerURL(user.id, user.banner, format, size, dynamic)
          if (user.banner === null && user.banner_color !== null) Data = `https://cdn.discordapp.com/attachments/862725255440891964/892066523789803620/unnamed.png`;
          if (user.banner === null && user.banner_color === null) Data = `https://cdn.discordapp.com/attachments/862725255440891964/892066523789803620/unnamed.png`;
        })
    } catch (err) {
      throw new Error("An unexpected error occurred.");
    }
    return Data
  },
}