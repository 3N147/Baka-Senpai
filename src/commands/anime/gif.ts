import axios from "axios"
import { MessageEmbed } from "discord.js"
import { color } from "../../config"
import { titleCase } from "../../functions/string/normalize"
import { Command } from "../../structures/Command"

export default new Command({
    name: "anime-gif",
    description: "Get an anime gif.",
    options: [
        {
            type: 3,
            name: "action",
            description: "Type of the gif",
            choices: ["blush", "cringe", "cry", "kick", "kiss", "pat", "slap", "bully", "wave"].map((x) => ({
                name: titleCase(x),
                value: x,
            })),
            required: true,
        },
        {
            type: 6,
            name: "user",
            description: "The target user.",
            required: true,
        },
    ],
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
    async execute(command) {
        const target = command.options.getUser("user").username.split(/ +/g).join(" ")
        const type = command.options.getString("action")
        const user = titleCase(command.user.username.split(/ +/g).join(" "))

        let image = await axios(`https://api.waifu.pics/sfw/${type}`)
            .then((x) => x.data)
            .catch(console.error)

        let title
        if (type === "blush") title = `${target} is blushing. OwO`
        if (type === "cringe") title = `${user} is dieing from cringe.`
        if (type === "cry") title = `${target} made ${user} cry.`
        if (type === "kick") title = `${user} kicked ${target}`
        if (type === "kiss") title = `Imagine kissing someone using me.`
        if (type === "pat") title = `Ohh! Cute little ${target}`
        if (type === "slap") title = `${user} slapped ${target}`
        if (type === "bully") title = `Bullying is bad tho..`
        if (type === "wave") title = `Hi ${target}.`
        let embeds = [new MessageEmbed().setColor(color).setTitle(title).setImage(image.url)]
        command.followUp({ embeds })
    },
})
