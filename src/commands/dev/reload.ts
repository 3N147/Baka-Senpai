import { client } from "../.."
import { guildId } from "../../config"
import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "reload",
    description: "Reload all slash commands",
    devOnly: true,
    ephemeral: true,
    async execute(command) {
        const commands = Array.from(client.commands.values())

        await client.registerCommands({ commands, guildId })
        await client.registerCommands({ commands: commands.filter((x) => !x.devOnly) })

        followUp(command, `Total ${client.commands.size} modules are reloaded.`)
    },
})
