import { TextChannel, WebhookClient } from "discord.js"
import { AnimeNews, AnimeNewsDataType } from "../../schema/animenews"
import { Command } from "../../structures/Command"

export default new Command({
    name: "anime-news",
    description: "Setup anime news posting channels",
    options: [
        {
            type: "SUB_COMMAND",
            name: "setup",
            description: "Set a channel to post anime news.",
            options: [
                {
                    type: "CHANNEL",
                    name: "channel",
                    description: "The target channel to post news.",
                    channelTypes: ["GUILD_TEXT", "GUILD_NEWS"],
                    required: true,
                },
                {
                    type: "STRING",
                    name: "name",
                    description: "Name of the bot that will post news.",
                },
                {
                    type: "ATTACHMENT",
                    name: "avatar",
                    description: "Avatar of the bot that will post news",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "stop",
            description: "Stop anime news posting .",
        },
    ],
    permissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"],
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "MANAGE_WEBHOOKS"],

    async execute(command) {
        const { options, client, guildId } = command
        const subCommand = options.getSubcommand()

        if (subCommand === "stop") {
            const data = (await AnimeNews.findOne({ guildId })) as AnimeNewsDataType
            if (data) {
                const webhook = new WebhookClient({ url: data.webhookURL })
                if (webhook) webhook.delete()
                data.delete()
            }

            return command.followUp(`All anime new posting in has been stopped.`)
        }

        const channel = options.getChannel("channel") as TextChannel
        const name = options.getString("name") ?? client.user.username
        const avatar = options.getAttachment("avatar")?.url ?? client.user.displayAvatarURL({ size: 4096 })
        const channelId = channel.id
        const exists = await AnimeNews.findOne({ guildId })

        if (exists) return command.followUp(`This server already have an anime news alert.`)

        const webhook = await channel.createWebhook(name, { avatar })

        AnimeNews.create({ guildId, channelId, webhookURL: webhook.url })

        command.followUp(`I will send new anime news in ${channel}.`)
    },
})
