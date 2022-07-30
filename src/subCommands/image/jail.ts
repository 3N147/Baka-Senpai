import { SubCommand } from "../../structures/SubCommand"
import Canvas from "canvas"
import { MessageAttachment, MessageEmbed } from "discord.js"
import { color } from "../../config"
import { fitCover } from "../../functions/canvas/fitCover"
export default new SubCommand("jail", async (command) => {
    const user = command.options.getUser("user")

    const canvas = Canvas.createCanvas(500, 500)
    const ctx = canvas.getContext("2d")

    const avatarURL = user.displayAvatarURL({ dynamic: false, format: "png", size: 512 })

    await Canvas.loadImage(avatarURL)
        .then((avatar) => ctx.drawImage(avatar, 0, 0, 500, 500))
        .catch(console.error)

    const jail = await Canvas.loadImage("./assets/images/jail-bars.png")

    await fitCover(ctx, canvas, jail)

    const files = [new MessageAttachment(canvas.toBuffer(), "jail.png")]

    command.followUp({ files }).catch(console.error)
})
