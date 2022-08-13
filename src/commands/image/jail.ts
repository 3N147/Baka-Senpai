import { createCanvas, Image, loadImage } from "canvas"
import { MessageAttachment } from "discord.js"
import { fitCover } from "../../functions/canvas/fitCover"
import { logError } from "../../functions/log/logger"
import { Command } from "../../structures/Command"
export default new Command({
    name: "jail",
    description: "Send someone to jail.",
    options: [
        {
            type: 6,
            name: "user",
            description: "The innocent criminal.",
            required: true,
        },
    ],
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "ATTACH_FILES"],
    async execute(command) {
        const user = command.options.getUser("user")

        const canvas = createCanvas(500, 500)
        const ctx = canvas.getContext("2d")

        const avatarURL = user.displayAvatarURL({ dynamic: false, format: "png", size: 512 })

        await loadImage(avatarURL)
            .then((avatar) => ctx.drawImage(avatar, 0, 0, 500, 500))
            .catch(console.error)

        const jail =
            command.client.images.get("jail-bars.png") ??
            ((await loadImage("./assets/images/jail-bars.png").catch(logError)) as Image)

        if (jail) await fitCover(ctx, canvas, jail)

        const files = [new MessageAttachment(canvas.toBuffer(), "jail.png")]

        command.followUp({ files }).catch(console.error)
    },
})
