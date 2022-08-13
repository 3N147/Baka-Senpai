import { logError } from "../functions/log/logger"
import { Event } from "../structures/Event"
import { ExtendedAutoComplete } from "../typings/Command"

export default new Event("interactionCreate", async (interaction: ExtendedAutoComplete) => {
    if (!interaction.isAutocomplete()) return

    const { commandName, client } = interaction

    const command = client.commands.get(commandName)

    if (!command || !command.autocomplete) return

    const choices = await command.autocomplete(interaction).catch(logError)

    if (!choices || !choices.length) return

    await interaction.respond(choices).catch(logError)
})
