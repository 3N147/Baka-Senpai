import { Command } from "../../structures/Command"
import yts from "yt-search"
import {
    CacheType,
    Message,
    MessageComponentInteraction,
    MessageSelectMenu,
    MessageSelectOptionData,
    SelectMenuInteraction,
} from "discord.js"
import { emojis, waitTime } from "../../config"
import { createRow } from "../../functions/discord/components"
import { SelectMenu } from "../../structures/selectMenu"
import { logError } from "../../functions/log/logger"
import { collectorFilter } from "../../functions/discord/collectorFilter"

export default new Command({
    name: "youtube",
    description: "Search videos from YouTube.",
    options: [
        {
            type: "STRING",
            name: "query",
            description: "What you want to search?",
            required: true,
        },
    ],
    ephemeral: true,
    async execute(command) {
        const { options, user } = command
        const query = options.getString("query")
        const results = await yts({ query })
        const selectOptions: MessageSelectOptionData[] = results.videos.map((video) => ({
            label: video.title,
            value: video.videoId,
            emoji: emojis.rightArrow,
            description: video.description?.substring(0, 100) || null,
        }))

        const components = [
            createRow(
                new MessageSelectMenu()
                    .setCustomId("yt-search")
                    .setMaxValues(1)
                    .setPlaceholder("Select a video for more details.")
                    .setOptions(selectOptions.slice(0, 25)),
            ),
        ]

        let content = "Here is your search result."

        const message = (await command.followUp({ components, content })) as Message

        if (!message) return

        const filter = (i: MessageComponentInteraction) => collectorFilter(i, user)

        const collector = message.createMessageComponentCollector({ idle: waitTime, filter })

        collector.on("collect", async (interaction: SelectMenuInteraction) => {
            const id = interaction.values[0]

            interaction.deferUpdate()

            const content = `https://www.youtube.com/watch?v=${id}`

            command.editReply({ content }).catch(logError)
        })

        collector.on("end", async (): Promise<any> => command.editReply({ components: [] }).catch(logError))
    },
})
