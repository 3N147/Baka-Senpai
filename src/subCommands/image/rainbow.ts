import { createCanvas, loadImage } from "canvas"
import { MessageAttachment, MessageEmbed } from "discord.js"
import { color, developers } from "../../config"
import { fitCover } from "../../functions/canvas/fitCover"
import { randomNumber } from "../../functions/string/randomNumber"
import { SubCommand } from "../../structures/SubCommand"

export default new SubCommand("rainbow", async (command) => {
    let user = command.options.getUser("user") || command.user
    const rating = randomNumber(user, "rainbow")

    let opacity = Math.floor(rating) / 100

    if (developers.includes(user.id)) opacity = 0

    const canvas = createCanvas(500, 500)
    const ctx = canvas.getContext("2d")

    let avatarURL = user.displayAvatarURL({ dynamic: false, format: "png", size: 512 })

    await loadImage(avatarURL)
        .then((avatar) => ctx.drawImage(avatar, 0, 0, 500, 500))
        .catch(console.error)

    let rainbowImage = await loadImage("./assets/images/rainbow.png")

    ctx.globalAlpha = opacity

    fitCover(ctx, canvas, rainbowImage)

    const files = [new MessageAttachment(canvas.toBuffer(), "rainbow.png")]
    const embeds = [new MessageEmbed().setColor(color).setImage("attachment://rainbow.png")]

    command.followUp({ embeds, files }).catch(console.error)
})
