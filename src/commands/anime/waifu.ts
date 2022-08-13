import axios from "axios"
import { MessageAttachment, MessageEmbed, TextChannel } from "discord.js"
import { color } from "../../config"
import { getEmbed } from "../../functions/discord/getEmbed"
import { followUp } from "../../functions/discord/message"
import { titleCase } from "../../functions/string/normalize"
import { Command } from "../../structures/Command"

export default new Command({
    name: "waifu",
    description: "Get an waifu image.",
    options: [
        {
            type: "BOOLEAN",
            name: "nsfw",
            description: "Whither get age-restricted images or not.",
            required: false,
        },
    ],
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
    async execute(command) {
        const { options } = command
        const channel = command.channel as TextChannel

        const nsfw = !!options.getBoolean("nsfw")

        if (nsfw && !channel.nsfw)
            return followUp(
                command,
                `Age restricted content in not enable in this channel. You can enable it from channel settings.`,
            )

        const imageType = nsfw ? "nsfw" : "sfw"

        let image = await axios(`https://api.waifu.pics/${imageType}/waifu`)
            .then((x) => x.data)
            .catch(console.error)

        if (!image) return

        let files = [new MessageAttachment(image.url, "waifu.png").setSpoiler(nsfw)]
        command.followUp({ files })
    },
})
