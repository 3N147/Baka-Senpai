import { MessageComponentInteraction, User } from "discord.js"
import { interactionReply } from "./message"

export async function collectorFilter(interaction: MessageComponentInteraction, ...allowedUsers: User[]) {
    if (!allowedUsers.some((user) => user.id === interaction.user.id)) {
        interactionReply(interaction, `You can't use this button/select menu.`, true)
        return false
    }
    return true
}
