import axios from "axios"
import { error } from "console"
import { MessageEmbed } from "discord.js"
import { color } from "../../config"
import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "character",
    description: "Search character from My Anime List.",
    options: [
        {
            type: "STRING",
            name: "name",
            description: "Name of the character.",
            required: true,
        },
    ],
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
    async execute(command) {
        const name = command.options.getString("name")

        let data = await axios(`https://api.jikan.moe/v4/characters?q=${name}`)
            .then((x) => x.data.data[0])
            .catch(error)

        if (!data) return followUp(command, "Please type the name correctly.")

        let embeds = [
            new MessageEmbed().setColor(color).setImage(data.images?.jpg?.image_url || data.images?.webp?.image_url),
            new MessageEmbed()
                .setColor(color)
                .setDescription(
                    `${data.nicknames.length ? `Nicknames: ${data.nicknames.join(", ")}\n` : ""}${data.about}`,
                )
                .setTitle(data.name)
                .setURL(data.url),
        ]

        command.followUp({ embeds }).catch(error)
    },
})
