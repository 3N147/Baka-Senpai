import { Command } from "../../structures/Command"
import deepai from "deepai"
import { MessageAttachment } from "discord.js"
import { followUp } from "../../functions/discord/message"

export default new Command({
    name: "upscale",
    description: "Up scale your favorite waifu image.",
    options: [
        {
            type: "STRING",
            name: "url",
            description: "Url/Link of your waifu image.",
            required: false,
        },

        {
            type: "ATTACHMENT",
            name: "upload",
            description: "Upload the image.",
            required: false,
        },
    ],
    aliases: ["waifu2x"],
    async execute(command) {
        const url = command.options.getAttachment("upload")?.url ?? command.options.getString("url")

        if (!url) return followUp(command, `You must upload an image or give an URL of an image.`)

        const data = await deepai.callStandardApi("waifu2x", { image: url }).catch(console.error)

        if (!data) return followUp(command, `Failed to upscale the image.`)

        const files = [new MessageAttachment(data.output_url, command.id + ".png")]

        command
            .followUp({
                content: `Here is your up scaled image. [Download](${data.output_url})(For Limited Time.)`,
                files,
            })
            .catch(console.error)
    },
})
