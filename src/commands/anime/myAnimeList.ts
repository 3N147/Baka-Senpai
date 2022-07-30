import axios from "axios"
import {
    MessageSelectOptionData,
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu,
    Message,
    SelectMenuInteraction,
} from "discord.js"
import { color, waitTime } from "../../config"
import { collectorFilter } from "../../functions/discord/collectorFilter"
import { getDynamicTime } from "../../functions/discord/getDynamicTime"
import { getEmbed } from "../../functions/discord/getEmbed"
import { followUp, interactionReply } from "../../functions/discord/message"
import { timeOut } from "../../functions/discord/timeout"
import { spacing, titleCase } from "../../functions/string/normalize"
import { Command } from "../../structures/Command"

export default new Command({
    name: "myanimelist",
    description: "Search anime or manga from My Anime List.",
    options: [
        {
            type: "STRING",
            name: "type",
            description: "Content type:",
            choices: [
                {
                    name: "Anime",
                    value: "anime",
                },

                {
                    name: "Manga",
                    value: "manga",
                },
            ],
            required: true,
        },
        {
            type: "STRING",
            name: "name",
            description: "Name of the content you want search.",
            required: true,
        },
    ],
    async execute(command) {
        const type = command.options.getString("type")
        const name = command.options.getString("name")

        let axiosData: any = await axios(`https://api.jikan.moe/v4/${type}?q=${name}&sfw`).catch(console.error)
        if (!axiosData?.data) followUp(command, `There is an error in the API.`)
        const data = axiosData.data.data

        const options: MessageSelectOptionData[] = data.map((media: any, i: number) => {
            const date = media.published?.from?.substr(0, 4) || media.aired?.from?.substr(0, 4)

            const label = titleCase(`${media.title_english || media.title}`.substr(0, 90))
            const value = `${i}`
            const description = titleCase(
                `${type}${date ? " - " + date : ""}${media.synopsis ? " - " : ""}${media.synopsis || ""}`.substr(0, 90),
            )
            return { label, value, description } as MessageSelectOptionData
        })

        if (!options.length) return followUp(command, "Please type the name correctly.")

        let embeds = [
            new MessageEmbed()
                .setTitle(`Select an ${type} from the search result to get more information.`)
                .setColor(color),
        ]

        let components = [
            new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId("anime_search")
                    .setPlaceholder(`Select ${type === "anime" ? "an anime" : "a manga"} from here.`)
                    .setOptions(options.slice(0, 20))
                    .setMaxValues(1)
                    .setMinValues(1),
            ),
        ]

        const message = (await command.followUp({ embeds, components }).catch(console.error)) as Message

        const filter = (interaction) => collectorFilter(interaction, command.user)

        const collector = message.createMessageComponentCollector({ idle: waitTime, filter })

        collector.on("collect", (selectMenu: SelectMenuInteraction) => {
            selectMenu.deferUpdate()

            const index = parseInt(selectMenu.values[0])

            const media = data[index]

            const cross = "❌"
            let started: string
            let ended: string

            if (media.published) {
                started = media.published.from ? getDynamicTime(media.published.from, "SHORT") : cross
                ended = media.published.to ? getDynamicTime(media.published.to, "SHORT") : cross
            } else {
                started = media.aired.from ? getDynamicTime(media.aired.from, "SHORT") : cross
                ended = media.aired.to ? getDynamicTime(media.aired.to, "SHORT") : cross
            }

            const demographics = media.demographics?.length
                ? media.demographics.map(({ name }) => name).join(", ")
                : null

            const genres = media.genres?.length ? media.genres.map(({ name }) => name).join(", ") : null

            const synopsis = media.synopsis ? spacing(media.synopsis) : "** **"
            const background = media.background ? "**background : **" + spacing(media.background) : "** **"

            const embeds = [
                getEmbed(command).setImage(media.images?.webp?.image_url),
                new MessageEmbed()
                    .setTitle(titleCase(media.title_english || media.title || cross))
                    .setDescription(synopsis + "\n" + background)
                    .setColor(color)
                    .setFields(
                        {
                            name: "Type:",
                            value: media.type || cross,
                            inline: true,
                        },
                        {
                            name: "Source:",
                            value: media.source || cross,
                            inline: true,
                        },
                        {
                            name: "Status:",
                            value: titleCase(media.status) || cross,
                            inline: true,
                        },
                        {
                            name: "Started:",
                            value: started || cross,
                            inline: true,
                        },
                        {
                            name: "Ended:",
                            value: ended || cross,
                            inline: true,
                        },
                        {
                            name: `${type == "manga" ? "Chapters:" : "Episodes:"}`,
                            value: `${media.episodes || media.chapters || cross}`,
                            inline: true,
                        },
                        {
                            name: "Scores:",
                            value: `${media.scored || media.score || cross}`,
                            inline: true,
                        },
                        {
                            name: "Age:",
                            value: media.rating || cross,
                            inline: true,
                        },
                        {
                            name: "Demographics:",
                            value: demographics || cross,
                            inline: true,
                        },
                        { name: "Genres:", value: genres || cross },
                    ),
            ]

            message.edit({ embeds }).catch(console.error)
        })

        collector.on("end", (collection): any => {
            if (collection.size !== 0) return timeOut("NOREPLY", { message })
            timeOut("TIMEOUT", { message })
        })
    },
})
