class Command {
    constructor(client, {
        name = null,
        aliases = [],
        description = [],
        category = null,
        Aris = false,
        Founder = false,
        enabled = true,
        cooldown = 1,

    }) {
        this.client = client;
        this.config = {
            Aris,
            Founder,
            enabled,
        };
        this.info = {
            name,
            aliases,
            category,
            description,
            cooldown
        };
    }
    async run() {

    }
}
module.exports = Command;