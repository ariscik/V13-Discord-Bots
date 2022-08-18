const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
class EventHandler {
    static async events(client, filePath, dirname) {
        try {
            const evtFiles = await readdir(dirname + filePath + "/");
            client.logger.log(`Toplam ${evtFiles.length} adet etkinlik yüklenecek.`);
            evtFiles.forEach((file) => {
                const eventName = file.split(".")[0];
                client.logger.log(`Yüklenen Etkinlik: ${eventName}`, "load");
                const event = new (require(dirname + filePath + `/${file}`))(client);
                client.on(event.Event, (...args) => event.run(...args));
                delete require.cache[require.resolve(dirname + filePath + `/${file}`)];
            })
        } catch (e) {
            client.logger.error(`Event yüklenemedi ${dirname}: ${e}`)
        }
    };
}
module.exports = EventHandler;