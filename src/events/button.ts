import { client } from ".."
import { interactionReply } from "../functions/discord/message"
import { logError } from "../functions/log/logger"
import { titleCase } from "../functions/string/normalize"
import { Event } from "../structures/Event"
import { ExtendedButton } from "../typings/Components"

export default new Event("interactionCreate", async (interaction: ExtendedButton) => {
    if (!interaction.isButton()) return

    const button = client.buttons.get(interaction.customId)

    if (!button) return

    if (button.permissions?.length) {
        const permissions = button.permissions?.filter((permission) => interaction.member.permissions.has(permission))
        const content = `You need \`${titleCase(permissions.join(", "))}\` permission(s) to use this select menu.`

        if (permissions.length) return interactionReply(interaction, content)
    }

    try {
        button.execute(interaction)
    } catch (error) {
        logError(error)
    }
})
