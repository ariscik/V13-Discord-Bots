const children = require("child_process");
class PM extends Command {
    constructor(client) {
        super(client, {
            name: "pm2",
            aliases: ["pm2","aris"],
            Aris: true,
        });
    }
    async run(client, message, args) {
        const ls = children.exec(`pm2 ${args.join(' ')}`);
        ls.stdout.on('data', function (data) {
            const arr = Discord.Util.splitMessage(data, { maxLength: 1950, char: "\n" });
            arr.forEach(element => {
                message.channel.send(Discord.Formatters.codeBlock("js", element));
            });
        });
    }
}

module.exports = PM