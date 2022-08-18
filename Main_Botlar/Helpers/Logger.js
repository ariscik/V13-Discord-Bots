const chalk = require("chalk");
const moment = require("moment");
moment.locale("tr")

class Logger {
  static log(content, type = "log") {
    moment.locale("tr")
    const timestamp = `[${moment(Date.now() + 10800000).format("LLL")}]:`;
    switch (type) {
      case "log": {
        return console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `);
      }
      case "warn": {
        return console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content} `);
      }
      case "error": {
        return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
      }
      case "debug": {
        return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content} `);
      }
      case "cmd": {
        return console.log(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`);
      }
      case "ready": {
        return console.log(`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${content}`);
      }
      case "reconnecting": {
        return console.log(`${timestamp} ${chalk.black.bgHex('#133729')(type.toUpperCase())} ${content}`);
      }
      case "disconnecting": {
        return console.log(`${timestamp} ${chalk.black.bgHex('#782020')(type.toUpperCase())} ${content}`);
      }
      case "load": {
        return console.log(`${timestamp} ${chalk.black.bgHex('#7B78B4')(type.toUpperCase())} ${content}`);
      }
      case "mngdb": {
        return console.log(`${timestamp} ${chalk.black.bgHex('#F9D342')(type.toUpperCase())} ${content}`);
      } 
      case "category": {
        return console.log(`${timestamp} ${chalk.black.bgHex('#E8D4A9')(type.toUpperCase())} ${content}`);
      }
      default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
    }
  }

  static error(content) {
    return this.log(content, "error");
  }

  static warn(content) {
    return this.log(content, "warn");
  }

  static debug(content) {
    return this.log(content, "debug");
  }

  static cmd(content) {
    return this.log(content, "cmd");
  }
}

module.exports = Logger;
