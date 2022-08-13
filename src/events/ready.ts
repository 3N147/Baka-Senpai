import { ActivitiesOptions } from "discord.js"

import { guildId } from "../config"
import { LogStart } from "../functions/log/logger"
import { getRandomItem } from "../functions/random/random"

import { ExtendedClient } from "../structures/Client"
import { Event } from "../structures/Event"

export default new Event("ready", async (client: ExtendedClient) => {
    console.log(`${client.user.tag} is ready.`)

    LogStart(client)

    const commands = Array.from(client.commands.values())

    await client.registerCommands({ commands, guildId })

    const memberCount = client.guilds.cache.reduce((a, { memberCount }) => a + memberCount, 0)
    const serverCount = client.guilds.cache.size

    client.user.setStatus("idle")
    const botActivities: ActivitiesOptions[] = [
        {
            type: "STREAMING",
            name: "DM me to chat.",
        },
        {
            type: "LISTENING",
            name: `${memberCount} members.`,
        },
        {
            type: "PLAYING",
            name: `in ${serverCount} servers!`,
        },
        {
            type: "WATCHING",
            name: "Anime.",
        },
    ]

    client.user.setActivity(botActivities[0])
    setTimeout(() => client.user.setActivity(getRandomItem(botActivities)), 1000 * 60 * 10)
})
