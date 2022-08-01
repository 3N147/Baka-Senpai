import GIFEncoder from "gifencoder"
import { MessageAttachment } from "discord.js"
import { createCanvas, loadImage } from "canvas"
import { Command } from "../../structures/Command"

export default new Command({
    name: "trigger",
    description: "Trigger someone.",
    options: [
        {
            type: 6,
            name: "user",
            description: "Target user to trigger.",
            required: true,
        },
    ],

    async execute(command) {
        const user = command.options.getUser("user") || command.user

        const avatar = user.displayAvatarURL({ dynamic: false, format: "png" })

        const base = await loadImage("./assets/images/triggered.png")
        const img = await loadImage(avatar)
        const GIF = new GIFEncoder(256, 310)
        GIF.start()
        GIF.setRepeat(0)
        GIF.setDelay(15)
        const canvas = createCanvas(256, 310)
        const ctx = canvas.getContext("2d")
        const BR = 30
        const LR = 20
        let i = 0
        while (i < 9) {
            ctx.clearRect(0, 0, 256, 310)
            ctx.drawImage(
                img,
                Math.floor(Math.random() * BR) - BR,
                Math.floor(Math.random() * BR) - BR,
                256 + BR,
                310 - 54 + BR,
            )
            ctx.fillStyle = "#FF000033"
            ctx.fillRect(0, 0, 256, 310)
            ctx.drawImage(
                base,
                Math.floor(Math.random() * LR) - LR,
                310 - 54 + Math.floor(Math.random() * LR) - LR,
                256 + LR,
                54 + LR,
            )
            GIF.addFrame(ctx)
            i++
        }
        GIF.finish()

        const files = [new MessageAttachment(GIF.out.getData(), "triggered.gif")]

        command.followUp({ files }).catch(console.error)
    },
})
