const { ariscik, voiceUser } = require("../../../Helpers/Schemas");
class voiceReward {
  Event = "voiceStateUpdate"
  async run(newState, oldState) {
const aris = await ariscik.findOne({ guildID: config.guildID})
const voiceData = await voiceUser.findOne({ guildID: config.guildID, userID: oldState.id });
if (!aris.levelLog) return;
if(voiceData) {
if(voiceData.topStat >= 360000000) {
if(oldState.member.roles.cache.has(aris.vBronz) || oldState.member.roles.cache.has(aris.vGumus) || oldState.member.roles.cache.has(aris.vAltin) || oldState.member.roles.cache.has(aris.vElmas)) return;
client.channels.cache.get(aris.levelLog).send(`:tada: ${oldState.member} Tebrikler! Ses istatistiklerin **Ses Bronz** rolüne sahip olmanızı sağladı!`)
oldState.member.roles.add(aris.vBronz)
}
if(voiceData.topStat >= 1080000000) {
if(oldState.member.roles.cache.has(aris.vGumus) || oldState.member.roles.cache.has(aris.vAltin) || oldState.member.roles.cache.has(aris.vElmas)) return;
client.channels.cache.get(aris.levelLog).send(`:tada: ${oldState.member} Tebrikler! Ses istatistiklerin **Ses Gümüş** rolüne sahip olmanızı sağladı!`)
oldState.member.roles.add(aris.vGumus)
oldState.member.roles.remove(aris.vBronz)
}
if(voiceData.topStat >= 2700000000) {
if(oldState.member.roles.cache.has(aris.vAltin) || oldState.member.roles.cache.has(aris.vElmas)) return;
client.channels.cache.get(aris.levelLog).send(`:tada: ${oldState.member} Tebrikler! Ses istatistiklerin **Ses Altın** rolüne sahip olmanızı sağladı!`)
oldState.id.roles.add(aris.vAltin)
oldState.member.roles.remove(aris.vGumus)
}
if(voiceData.topStat >= 7200000000) {
if(oldState.member.roles.cache.has(aris.vElmas)) return;
client.channels.cache.get(aris.levelLog).send(`:tada: ${oldState.member} Tebrikler! Ses istatistiklerin **Ses Elmas** rolüne sahip olmanızı sağladı!`)
oldState.member.roles.add(aris.vElmas)
oldState.member.roles.remove(aris.vAltin)
}
}

   }  
}

module.exports = voiceReward