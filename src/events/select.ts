import { client } from ".."
import { interactionReply } from "../functions/discord/message"
import { logError } from "../functions/log/logger"
import { titleCase } from "../functions/string/normalize"
import { Event } from "../structures/Event"
import { ExtendedSelect } from "../typings/Components"

export default new Event("interactionCreate", async (interaction: ExtendedSelect) => {
    if (!interaction.isSelectMenu()) return

    const select = client.selectMenus.get(interaction.customId)

    if (!select) return

    if (select.permissions?.length) {
        const permissions = select.permissions?.filter((permission) => interaction.member.permissions.has(permission))
        const content = `You need \`${titleCase(permissions.join(", "))}\` permission(s) to use this select menu.`

        if (permissions.length) return interactionReply(interaction, content, true)
    }

    try {
        select.execute(interaction)
    } catch (error) {
        logError(error)
    }
})
