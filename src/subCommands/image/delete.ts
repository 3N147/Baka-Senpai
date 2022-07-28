import { SubCommand } from "../../structures/SubCommand"
import { createCanvas, loadImage, registerFont } from "canvas"
import { MessageAttachment, MessageEmbed } from "discord.js"
import { color } from "../../config"
import { followUp } from "../../functions/discord/message"

export default new SubCommand("delete", async (command) => {
    const user = command.options.getUser("user")

    const canvas = createCanvas(1150, 472)
    const ctx = canvas.getContext("2d")

    await loadImage("assets/images/delete.png")
        .then((image) => ctx.drawImage(image, 0, 0, canvas.width, canvas.height))
        .catch(console.error)

    registerFont("assets/fonts/Rubik.ttf", { family: "Rubik" })
    ctx.fillStyle = "black"
    ctx.font = "35px 'RubiK'"

    ctx.fillText(`${user.tag.replace(/( |!)+/g, " ").trim()}.poop`, 435, 195)

    await loadImage(user.displayAvatarURL({ dynamic: false, format: "png", size: 512 }))
        .then((img) => ctx.drawImage(img, 150, 170, 260, 260))
        .catch(console.error)

    const files = [new MessageAttachment(canvas.toBuffer(), "Delete.png")]
    const embeds = [new MessageEmbed().setColor(color).setImage("attachment://Delete.png")]

    command.followUp({ embeds, files }).catch(console.error)
})
