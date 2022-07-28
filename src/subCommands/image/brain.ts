import { SubCommand } from "../../structures/SubCommand"
import { createCanvas, loadImage, registerFont } from "canvas"
import { MessageAttachment, MessageEmbed } from "discord.js"
import { color } from "../../config"
import { followUp } from "../../functions/discord/message"
import { getLines } from "../../functions/canvas/getLines"
import { ExtendedCommand } from "../../typings/Command"

export default new SubCommand("brain", async (command: ExtendedCommand) => {
    const { getString } = command.options
    let smallest = getString("smallest")
    let small = getString("small")
    let big = getString("big")
    let biggest = getString("biggest")

    const canvas = createCanvas(542, 767)
    const ctx = canvas.getContext("2d")

    try {
        await loadImage("assets/images/brain.jpg").then((img) => ctx.drawImage(img, 0, 0, canvas.width, canvas.height))
    } catch (error) {
        followUp(command, "There was error loading the image.")
        console.error(error)
    }
    registerFont("assets/fonts/Rubik.ttf", { family: "Rubik" })

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

    const embeds = [
        new MessageEmbed().setColor(color).setImage("attachment://Brain.png").setTitle("Here is the brain comparison."),
    ]
    return command.followUp({ embeds, files }).catch(console.error)
})
