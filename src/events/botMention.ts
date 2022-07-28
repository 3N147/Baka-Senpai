import { client } from ".."
import { messageReply } from "../functions/discord/message"
import { Event } from "../structures/Event"
import { matchString } from "../functions/string/perfectMatch"

export default new Event("messageCreate", async (message) => {
    const regex = new RegExp(`<@!?${client.user.id}>`, "g")

    if (!matchString(regex, message?.content ?? "")) return

    messageReply(message, `Use \`/help\` to get a list of all command.`)
})
