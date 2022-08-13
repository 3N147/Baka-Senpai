import { createCanvas, Image, loadImage, registerFont } from "canvas"
import { MessageAttachment, MessageEmbed } from "discord.js"
import { followUp } from "../../functions/discord/message"
import { getLines } from "../../functions/canvas/getLines"
import { ExtendedCommand } from "../../typings/Command"
import { Command } from "../../structures/Command"

export default new Command({
    name: "brain",
    description: "Good old brain meme",
    options: [
        {
            type: 3,
            name: "smallest",
            description: "Small",
            required: true,
        },
        {
            type: 3,
            name: "small",
            description: "Small",
            required: true,
        },
        {
            type: 3,
            name: "big",
            description: "big",
            required: true,
        },
        {
            type: 3,
            name: "biggest",
            description: "Biggest",
            required: true,
        },
    ],

    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "ATTACH_FILES"],
    async execute(command: ExtendedCommand) {
        const { getString } = command.options
        let smallest = getString("smallest")
        let small = getString("small")
        let big = getString("big")
        let biggest = getString("biggest")

        const image = command.client.images.get("brain.jpg") ?? (await loadImage("assets/images/brain.jpg"))

        if (!image) return followUp(command, `Error loading the image. Please try again.`)

        const canvas = createCanvas(image.width, image.height)
        const ctx = canvas.getContext("2d")

        ctx.drawImage(image, 0, 0, image.width, image.height)

        ctx.fillStyle = "black"
        ctx.font = "24px 'Rubik'"

        smallest = await getLines(ctx, smallest, 250)
        ctx.fillText(smallest, 10, 30)

        small = await getLines(ctx, small, 250)
        ctx.fillText(small, 10, 216)

        big = await getLines(ctx, big, 250)
        ctx.fillText(big, 10, 420)

        biggest = await getLines(ctx, biggest, 250)
        ctx.fillText(biggest, 10, 600)

        const files = [new MessageAttachment(canvas.toBuffer(), "Brain.png")]

        return command.followUp({ files })
    },
})
