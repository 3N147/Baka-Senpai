import { Collector, MessageComponentInteraction, User } from "discord.js"
import { interactionReply } from "./message"

export const collectorFilter = async (interaction: MessageComponentInteraction, user: User) => {
    if (interaction.user.id !== user.id) {
        interactionReply(interaction, `You can't use this button/select menu.`, true)
        return false
    }
    return true
}
