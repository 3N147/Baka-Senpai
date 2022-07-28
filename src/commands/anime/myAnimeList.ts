import axios from "axios"
import {
    MessageSelectOptionData,
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu,
    Message,
    SelectMenuInteraction,
} from "discord.js"
import { color } from "../../config"
import { followUp, interactionReply } from "../../functions/discord/message"
import { spacing, titleCase } from "../../functions/string/normalize"
import { Command } from "../../structures/Command"

export default new Command({
    name: "my-anime-list",
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
    aliases: ["search"],
    async execute(command) {
        const type = command.options.getString("type")
        const name = command.options.getString("name")

        let axiosData: any = await axios(`https://api.jikan.moe/v4/${type}?q=${name}&sfw`).catch(console.error)
        if (!axiosData?.data) followUp(command, `There is an error in the API.`)
        const data = axiosData.data.data
        console.log(data[0])

        let options = []

        await data.forEach((media: any, i: number) => {
            let option: MessageSelectOptionData = { label: "", value: "" }

            let date = media.published?.from?.substr(0, 4) || media.aired?.from?.substr(0, 4)

            option.label = titleCase(`${media.title_english || media.title}`.substr(0, 90))
            option.value = `${i}`
            option.description = titleCase(
                `${type}${date ? " - " + date : ""}${media.synopsis ? " - " : ""}${media.synopsis || ""}`.substr(0, 90)
            )
            option.default = false
            options.push(option)
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
                    .setPlaceholder(`Select ${type == "anime" ? "an anime" : "a manga"} from here.`)
                    .setOptions(options.slice(0, 20))
                    .setMaxValues(1)
                    .setMinValues(1)
            ),
        ]

        const message = (await command.followUp({ embeds, components }).catch(console.error)) as Message

        const collector = message.createMessageComponentCollector({ idle: 30_000 })

        collector.on("collect", (selectMenu: SelectMenuInteraction) => {
            if (selectMenu.user.id !== command.user.id) {
                interactionReply(selectMenu, `I didn't asked you.`, true)
                return collector.collected.delete(selectMenu.id) as any
            }
            selectMenu.deferUpdate()

            const media = data[parseInt(selectMenu.values[0])]

            const cross = "❌"
            let started: string
            let ended: string
            if (media.published) {
                started = `${
                    media.published.from
                        ? `<t:${Math.round(new Date(media.published.from).valueOf() / 1000)}:D>`
                        : cross
                }`
                ended = `${
                    media.published.to ? `<t:${Math.round(new Date(media.published.to).valueOf() / 1000)}:D>` : cross
                }`
            } else {
                started = `${
                    media.aired.from ? `<t:${Math.round(new Date(media.aired.from).valueOf() / 1000)}:D>` : cross
                }`
                ended = `${media.aired.to ? `<t:${Math.round(new Date(media.aired.to).valueOf() / 1000)}:D>` : cross}`
            }

            let demographics: string
            if (media.demographics?.length) {
                demographics = media.demographics.map((demographic) => demographic.name).join(", ")
            }

            let genres: string
            if (media.genres?.length) genres = media.genres.map((x) => x.name).join(", ")

            const embeds = [
                new MessageEmbed().setColor(color).setImage(media.images?.webp?.image_url),
                new MessageEmbed()
                    .setTitle(titleCase(media.title_english || media.title || cross))
                    .setDescription(
                        `${media.synopsis ? spacing(media.synopsis) : ""}\n${
                            media.background ? "**background : **" + spacing(media.background) : ""
                        }`
                    )
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
                        { name: "Genres:", value: genres || cross }
                    ),
            ]

            message.edit({ embeds }).catch(console.error)
        })

        collector.on("end", (collection) => {
            if (collection.size !== 0) return message.edit({ components: [] }).catch(console.error) as any
            embeds = [new MessageEmbed().setColor(color).setTitle(`No reply from the user. What a wait of time. :p`)]
            message.edit({ embeds, components: [] }).catch(console.error)
        })
    },
})
