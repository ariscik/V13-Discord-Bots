const { Client, Collection } = require('discord.js');
const FileSync = require('lowdb/adapters/FileSync');
const path = require("path")
const config = require("../../Settings/config.json")
const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
class Aris extends Client {
  constructor(options) {
    super(options);
    this.aliases = new Collection();
    this.commands = new Collection();
    this.cooldowns = new Collection();
    this.muteLimit = new Map();
    this.banLimit = new Map();
    this.jailLimit = new Map();
    this.kayitsizLimit = new Map();
    this.cmdLimit = new Map()
    this.beklemeSure = new Collection();
    this.adapters = file => new FileSync(`../../Settings/${file}.json`);
    this.login(config.Moderation).then(() =>
      this.logger.log(`${this.user.tag} olarak giriş yapıldı!`)).catch((error) =>
        this.logger.error("Discord API Botun tokenini doğrulayamadı." + error));
  }
  static async init() {
    let category = await readdir("./Commands/");
    client.logger.log(`Toplam ${category.length} kategori yüklenecek.`, "category");
    category.forEach(async (dir) => {
      let commands = await readdir("./Commands/" + dir + "/");
      commands.filter((cmd) => cmd.split(".").pop() === "js").forEach(async (cmd) => {
        const response = client.loadCommand("./Commands/" + dir, cmd);
        if (response) {
          client.logger.error(response, "error");
        }
      });
    });
  };
  loadCommand(commandPath, commandName) {
    try {
      const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
      this.logger.log(`Yüklenen Komut: ${props.info.name}`, "load");
      props.config.location = commandPath;
      if (props.init) {
        props.init(this);
      }
      this.commands.set(props.info.name, props);
      props.info.aliases.forEach(alias => {
        this.aliases.set(alias, props.info.name);
      });
      return false;
    } catch (e) {
      return `Komut yüklenirken hata oluştu: ${commandName}: ${e}`;
    }
  }
  async unloadCommand(commandPath, commandName) {
    let command;
    if (this.commands.has(commandName)) {
      command = this.commands.get(commandName);
    } else if (this.aliases.has(commandName)) {
      command = this.commands.get(this.aliases.get(commandName));
    }
    if (!command)
      return `\`${commandName}\` İsiminde herhangi bir komut bulunamadı!`;

    if (command.shutdown) {
      await command.shutdown(this);
    }
    delete require.cache[
      require.resolve(`${commandPath}${path.sep}${commandName}.js`)
    ];
  }
}


module.exports = { Aris }