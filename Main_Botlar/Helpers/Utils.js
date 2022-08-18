
module.exports = async (client) => {

  const emojis = global.emojis = require("../Settings/emojis.json")
  const config = global.config = require("../Settings/config.json")

  const inviteEngel = global.inviteEngel = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;

  const { Penalties } = global.Penalties = require("../Helpers/Schemas")
  const { ariscik } = global.aris = require("../Helpers/Schemas")
  const { tasks } = global.tasks = require("../Helpers/Schemas")
  const { coin } = global.coin = require("../Helpers/Schemas")
  const Discord = global.Discord = require("discord.js");
  const Command = global.Command = require("./Command")
  const voice = global.voice = require("@discordjs/voice")
  const low = global.low = require("lowdb")

  client.handler = require('./Handler')
  client.logger = require("./Logger")

  Discord.Collection.prototype.array = function () {
    return [...this.values()]
  }
  Array.prototype.clear = function () {
    this.splice(0, this.length);
  }

  Date.prototype.toTurkishFormatDate = function (format) {
    let date = this,
      day = date.getDate(),
      weekDay = date.getDay(),
      month = date.getMonth(),
      year = date.getFullYear(),
      hours = date.getHours(),
      minutes = date.getMinutes(),
      seconds = date.getSeconds();
    let monthNames = new Array("Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık");
    let dayNames = new Array("Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi");
    if (!format) {
      format = "dd MM yyyy - HH:ii:ss";
    };
    format = format.replace("mm", month.toString().padStart(2, "0"));
    format = format.replace("MM", monthNames[month]);
    if (format.indexOf("yyyy") > -1) {
      format = format.replace("yyyy", year.toString());
    } else if (format.indexOf("yy") > -1) {
      format = format.replace("yy", year.toString().substr(2, 2));
    };
    format = format.replace("dd", day.toString().padStart(2, "0"));
    format = format.replace("DD", dayNames[weekDay]);
    if (format.indexOf("HH") > -1) format = format.replace("HH", hours.toString().replace(/^(\d)$/, '0$1'));
    if (format.indexOf("ii") > -1) format = format.replace("ii", minutes.toString().replace(/^(\d)$/, '0$1'));
    if (format.indexOf("ss") > -1) format = format.replace("ss", seconds.toString().replace(/^(\d)$/, '0$1'));
    return format;
  };

  client.Penalties = async (guildID, userID, Ceza, Aktif = true, Yetkili, Sebep, Zaman, Sure, kalkmazamani = undefined) => {
    let id = await Penalties.find({ guildID });
    id = id ? id.length + 1 : 1;
    return await new Penalties({ id, guildID, userID, Ceza, Aktif, Yetkili, Sebep, Zaman, Sure, kalkmazamani }).save();
  };

  Discord.GuildMember.prototype.setRoles = function (roles) {
    const newRoles = this.roles.cache.filter(x => x.managed).map(x => x.id).concat(roles);
    return this.roles.set(newRoles)
  };

  Discord.GuildMember.prototype.hasRole = function (role, every = true) {
		return (
			(Array.isArray(role) &&
				((every && role.every((x) => this.roles.cache.has(x))) ||
					(!every && role.some((x) => this.roles.cache.has(x))))) ||
			(!Array.isArray(role) && this.roles.cache.has(role))
		);
	};

  Promise.prototype.sil = function (time) {
    if (this) this.then(message => {
      if (message.deletable)
        setTimeout(() => message.delete(), time * 1000)
    });
  };

  Discord.Message.prototype.deleteMsg = function (options = new Object()) {

    if (typeof options !== 'object') throw new TypeError('Invalid Argument : Options');

    let { timeout } = options;

    if (timeout && (isNaN(timeout) || timeout.toString().includes('-'))) throw new TypeError('Invalid Option : timeout')

    this.client.wait(timeout).then(() => this.delete());

  },

    Discord.GuildMember.prototype.updateTask = async function (guildID, type, data, channel = null) {
      const aris = await ariscik.findOne({ guildID: config.guildID });
      const taskData = await tasks.find({ guildID, userID: this.user.id, type, active: true });
      taskData.forEach(async (x) => {
        if (channel && x.channels && x.channels.some((x) => x !== channel.id)) return; x.completedCount += data;
        if (x.completedCount >= x.count) {
          x.active = false; x.completed = true;
          await coin.findOneAndUpdate({ guildID, userID: this.user.id }, { $inc: { coin: x.prizeCount } });
          if (aris.dailyMissionLog) client.channels.cache.get(aris.dailyMissionLog).send(`${this.toString()} Tebrikler! ${type.charAt(0).toLocaleUpperCase() + type.slice(1)} görevini başarılı bir şekilde tamamladın!\n**_______________________________**\n\nGörev: ${x.message}\nKazanılan Coin : **${x.prizeCount}**`)
        }
        await x.save();
      });
    };

  Discord.Client.prototype.wait = function (time = 0) {

    if (time && (isNaN(time) || time.toString().includes('-'))) throw new TypeError('Invalid Argument : Time')

    new Promise((resolve) => setTimeout(resolve, time));

  };

  client.fetchUser = async (userID) => {
    try {
      return await client.users.fetch(userID);
    } catch (err) {
      return undefined;
    }
  };

  client.fetchBan = async (guild, userID) => {
    try {
      return await guild.bans.fetch(userID);
    } catch (err) {
      return undefined;
    }
  };

  Array.prototype.chunk = function (chunk_size) {
    let myArray = Array.from(this);
    let tempArray = [];
    for (let index = 0; index < myArray.length; index += chunk_size) {
      let chunk = myArray.slice(index, index + chunk_size);
      tempArray.push(chunk);
    }
    return tempArray;
  }
  
  Array.prototype.random = function() {
    return this[(Math.floor(Math.random()*this.length))];
  };

}
