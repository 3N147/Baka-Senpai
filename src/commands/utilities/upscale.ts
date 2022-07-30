import { Command } from "../../structures/Command"
import deepai from "deepai"
import { Message, MessageAttachment } from "discord.js"
import { followUp } from "../../functions/discord/message"
import { createButton, createRow } from "../../functions/discord/components"
import { emojis, waitTime } from "../../config"
import { timeOut } from "../../functions/discord/timeout"

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

        const components = [createRow(createButton("Download", null, "LINK", false, emojis.download, data.output_url))]

        const message = (await command.followUp({ files, components }).catch(console.error)) as Message

        setTimeout((_) => timeOut("DISABLE", { message }, components), waitTime)
    },
})
