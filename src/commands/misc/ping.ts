import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "ping",
    description: "replies with pong",
    ephemeral: true,
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
    execute(command) {
        followUp(command, `ping is \`\`\`${command.client.ws.ping}\`\`\``)
    },
})
