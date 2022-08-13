import axios from "axios"
import { MessageEmbed } from "discord.js"
import { color } from "../config"
import { logError } from "../functions/log/logger"
import { Event } from "../structures/Event"

export default new Event("messageCreate", async (message) => {
    let { content, client, author, channel } = message

    if (channel.type !== "DM" || author.bot) return

    const name = `${client.user.username}'s assistant`

    content = encodeURIComponent(content)
    const botName = encodeURIComponent(name)

    const URL = `https://api.affiliateplus.xyz/api/chatbot?message=${content}&botname=${botName}&ownername=Ephemeral&user=${author.id}`

    const results = await axios(URL)
        .then((response) => response.data)
        .catch(logError)

    if (!results || results.error) return

    const msgContent = `**${name}:**\n> ${results.message}`

    message.reply({ content: msgContent, allowedMentions: { repliedUser: false } })
})
