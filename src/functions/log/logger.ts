import { DateResolvable, Guild, MessageEmbed, WebhookClient } from "discord.js"
import { ExtendedClient } from "../../structures/Client"
import { createButton, createRow } from "../discord/components"
import { getDynamicTime } from "../discord/getDynamicTime"
import { getAuthor } from "../discord/getEmbed"

const detailedTime = (date: DateResolvable) =>
    `${getDynamicTime(date, "LONG_TIME_AND_DATE")}  ${getDynamicTime(date, "RELATIVE")}`

export const LogStart = (client: ExtendedClient) => {
    if (!process.env.LOGIN) return
    const webhook = new WebhookClient({ url: process.env.LOGIN })

    const { guilds, user } = client

    const memberCount = guilds.cache.reduce((a, { memberCount }) => a + memberCount, 0)
    const guildCount = guilds.cache.size

    const description = `
    Time: ${detailedTime(new Date())}
    Members: ${memberCount}
    Guilds: ${guildCount}
    Client: [${user.username}](https://discord.com/developers/applications/${user.id}/bot)
    `

    const embeds = [
        new MessageEmbed()
            .setTitle("Login")
            .setColor("GREEN")
            .setDescription(description)
            .setAuthor(getAuthor(user))
            .setTimestamp(),
    ]
    const components = [createRow(createButton("Manage", `https://discord.com/developers/applications/${user.id}/bot`))]

    const avatarURL = client.user.displayAvatarURL()
    const username = `login:${client.user.tag}`

    webhook.send({ embeds, avatarURL, username, components }).catch(console.error)
}

export const logError = (error: Error) => {
    console.error(error)
    if (!process.env.ERROR) return
    if (error.message === "Missing Permissions") return

    const webhook = new WebhookClient({ url: process.env.ERROR })

    const embed = new MessageEmbed().setColor("RED").setTitle(error.name).setTimestamp()
    if (error.stack) {
        const des = error.stack
            .split("\n")
            .map((x) => "```" + x.trim() + "```")
            .join("\n")

        embed.setDescription(des)
    }

    const embeds = [embed]

    webhook.send({ embeds }).catch(console.error)
}

export const guildLog = (guild: Guild, event: "CREATE" | "DELETE") => {
    if (!process.env.GUILDS) return
    const webhook = new WebhookClient({ url: process.env.GUILDS })
    const description = `
    Name: ${guild.name}
    Members: ${guild.memberCount}
    Create: ${detailedTime(guild.me.joinedAt)}
    Remove: ${event === "DELETE" ? detailedTime(new Date()) : "❌"}
    `

    const embeds = [
        new MessageEmbed()
            .setColor(event === "CREATE" ? "GREEN" : "RED")
            .setDescription(description)
            .setAuthor({ name: guild.name })
            .setThumbnail(guild.iconURL())
            .setTimestamp(),
    ]

    const username = event === "CREATE" ? "Guild Create" : "Guild Delete"

    webhook.send({ embeds, username }).catch(console.error)
}
