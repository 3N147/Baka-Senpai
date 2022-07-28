import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "ping",
    description: "replies with pong",
    ephemeral: true,
    execute(command) {
        followUp(command, `Bot ping is \`${command.client.ws.ping}\``)
    },
})
