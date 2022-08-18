const util = require("util");
const { ariscik } = require("../../../../Helpers/Schemas");
class Eval extends Command {
    constructor(client) {
        super(client, {
            name: "eval",
            aliases: ["eval"],
            Aris: true,
        });
    }
    async run(client, message, args) {
        const aris = await ariscik.findOne({ guildID: config.guildID })
        function clean(text) {
            if (typeof (text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else return text;
        }
        if (!args[0]) return message.reply(`Kod belirtilmedi`);
        try {
            //eval("(async () => { " + code + "})();")
            const code = message.content.split(' ').slice(1).join(' ');
            let evaled = clean(await eval(code));
            if (typeof evaled !== "string") evaled = util.inspect(evaled).replace(client.token, "Siktir göt").replace(config.MongoURL, "https://pornhub.com/")
            const arr = Discord.Util.splitMessage(evaled, { maxLength: 1950, char: "\n" });
            arr.forEach(element => {
                message.channel.send(Discord.Formatters.codeBlock("js", element));
            });
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``)
        }
    }
}

module.exports = Eval