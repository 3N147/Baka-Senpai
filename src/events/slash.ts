import { Collection, Message } from "discord.js"
import { client } from ".."
import { developers } from "../config"
import { logError } from "../functions/log/logger"
import { titleCase } from "../functions/string/normalize"
import { Event } from "../structures/Event"
import { ExtendedCommand } from "../typings/Command"

export default new Event("interactionCreate", async (interaction: ExtendedCommand) => {
    if (!interaction.isCommand()) return

    interaction.smartFollowUp = async function (content, seconds) {
        const message = (await this.followUp(content).catch(logError)) as Message
        if (!message && !seconds) return message
        setTimeout(() => message.delete().catch(logError), seconds * 1000)
        return message
    }
    interaction.smartReply = async function (content, ephemeral, seconds) {
        const message = (await this.reply({ content, ephemeral: !!ephemeral, fetchReply: true }).catch(
            logError,
        )) as Message
        if (!message && !seconds) return message
        setTimeout(() => message.delete().catch(logError), seconds * 1000)
        return message
    }

    const command = client.commands.get(interaction.commandName)
    if (!command) return interaction.smartReply("This command is missing.", true)

    if (command.devOnly && !developers.includes(interaction.user.id))
        return interaction.smartReply(`Only bot developers can use this command.`, true)

    if (!developers.includes(interaction.user.id)) {
        const { coolDown } = client

        if (!coolDown.has(command.name)) coolDown.set(command.name, new Collection())

        const now = new Date().valueOf()
        const timestamps = coolDown.get(command.name)
        const coolDownAmount = (command.coolDown || 3) * 1000

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + coolDownAmount

            if (now < expirationTime) {
                const timeLeft = Math.round((expirationTime - now) / 1000)
                const content = `Slow down buddy! You can use \`${command.name}\` command in **${timeLeft}s**.`
                return interaction.smartReply(content, true)
            }
        }

        timestamps.set(interaction.user.id, now)
        setTimeout(() => timestamps.delete(interaction.user.id), coolDownAmount)

        if (command.permissions?.length) {
            const permissions = command.permissions?.filter(
                (permission) => !interaction.member.permissions.has(permission),
            )
            const content = `You need \`${titleCase(permissions.join(", "))}\` permission(s) to use this command.`
            if (permissions.length) return interaction.smartReply(content, true)
        }

        if (command.botPermissions?.length) {
            const permissions = command.botPermissions?.filter(
                (permission) => !interaction.guild.me.permissions.has(permission),
            )
            const content = `I need \`${titleCase(permissions.join(", "))}\` permission(s) to use this command.`
            if (permissions.length) return interaction.smartReply(content, true)
        }
    }

    command.ephemeral ? await interaction.deferReply({ ephemeral: true }) : await interaction.deferReply()

    try {
        return command.execute(interaction)
    } catch (error) {
        logError(error)
    }
})
