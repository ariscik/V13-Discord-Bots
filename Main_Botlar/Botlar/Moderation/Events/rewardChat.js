const { ariscik, messageUser } = require("../../../Helpers/Schemas");
class Message {
  Event = "messageCreate"
  async run(message) {
const aris = await ariscik.findOne({ guildID: config.guildID })
const mesajData = await messageUser.findOne({ guildID: config.guildID, userID: message.author.id });
if (!aris.levelLog) return;
if(mesajData) {
if(mesajData.topStat == 1000) {
client.channels.cache.get(aris.levelLog).send(`:tada: ${message.author} Tebrikler! Mesaj istatistiklerin **Chat Bronz** rolüne sahip olmanızı sağladı!`)
message.member.roles.add(aris.cBronz)
}
if(mesajData.topStat == 5000) {
client.channels.cache.get(aris.levelLog).send(`:tada: ${message.author} Tebrikler! Mesaj istatistiklerin **Chat Gümüş** rolüne sahip olmanızı sağladı!`)
message.member.roles.add(aris.cGumus)
message.member.roles.remove(aris.cBronz)
}
if(mesajData.topStat == 10000) {
client.channels.cache.get(aris.levelLog).send(`:tada: ${message.author} Tebrikler! Mesaj istatistiklerin **Chat Altın** rolüne sahip olmanızı sağladı!`)
message.member.roles.add(aris.cAltin)
message.member.roles.remove(aris.cGumus)
}
if(mesajData.topStat == 50000) {
client.channels.cache.get(aris.levelLog).send(`:tada: ${message.author} Tebrikler! Mesaj istatistiklerin **Chat Elmas** rolüne sahip olmanızı sağladı!`)
message.member.roles.add(aris.cElmas)
message.member.roles.remove(aris.cAltin)
}
}
}
}


module.exports = Message