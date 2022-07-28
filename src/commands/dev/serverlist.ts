import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "server-list",
    description: "Reload all slash command",
    options: [],
    ephemeral: true,
    async execute(command) {
        const servers = command.client.guilds.cache.map((server) => `\`${server.name}\``)
        followUp(command, servers.join("\n"))
    },
})
