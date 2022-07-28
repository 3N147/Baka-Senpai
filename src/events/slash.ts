import { Collection } from "discord.js"
import { client } from ".."
import { developers } from "../config"
import { followUp, interactionReply } from "../functions/discord/message"
import { titleCase } from "../functions/string/normalize"
import { Event } from "../structures/Event"
import { ExtendedCommand } from "../typings/Command"

export default new Event("interactionCreate", async (interaction: ExtendedCommand) => {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)
    if (!command) return interactionReply(interaction, "This command is missing.")

    command.ephemeral ? await interaction.deferReply({ ephemeral: true }) : await interaction.deferReply()

    if (command.devOnly && !developers.includes(interaction.user.id))
        return followUp(interaction, `Only bot developers can use this command.`)

    if (!developers.includes(interaction.user.id)) {
        const { coolDown } = client

        if (!coolDown.has(command.name)) {
            coolDown.set(command.name, new Collection())
        }

        const now = Date.now()
        const timestamps = coolDown.get(command.name)
        const coolDownAmount = (command.coolDown || 3) * 1000

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + coolDownAmount

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000
                return followUp(
                    interaction,
                    `Wait **${timeLeft.toFixed(1)}**s before reusing the \`${command.name}\` command.`
                )
            }
        }

        timestamps.set(interaction.user.id, now)
        setTimeout(() => timestamps.delete(interaction.user.id), coolDownAmount)

        if (command.permissions?.length) {
            const permissions = command.permissions?.filter(
                (permission) => !interaction.member.permissions.has(permission)
            )
            const content = `You need \`${titleCase(permissions.join(", "))}\` permission(s) to use this command`
            if (permissions.length) return followUp(interaction, content)
        }
    }

    try {
        return command.execute(interaction)
    } catch (error) {
        console.error(error)
    }
})
