import { ImageURLOptions } from "discord.js"
import { getDynamicTime } from "../../functions/discord/getDynamicTime"
import { getEmbed } from "../../functions/discord/getEmbed"
import { followUp } from "../../functions/discord/message"
import { titleCase } from "../../functions/string/normalize"
import { matchString } from "../../functions/string/perfectMatch"
import { Command } from "../../structures/Command"

export default new Command({
    name: "fetch-user",
    description: "Fetch user using id.",
    options: [
        {
            type: "STRING",
            name: "id",
            description: "ID of the user.",
            required: true,
        },
    ],
    devOnly: true,
    async execute(command) {
        const userId = command.options.getString("id")
        if (!matchString(/\d{17,19}/, userId)) return followUp(command, "Id must be a string of number.")

        const user = await command.client.users.fetch(userId).catch(console.error)

        if (!user) return followUp(command, "Failed to fetch user!")

        const description = `
        Create: ${getDynamicTime(user.createdAt, "LONG_DATE")}
        Badges: ${titleCase(user.flags.toArray().join(", "))}
        `
        const imgURLOptions: ImageURLOptions = { size: 4096 }

        const embed = getEmbed(command)
            .setTitle(user.tag)
            .setDescription(description)
            .setThumbnail(user.displayAvatarURL(imgURLOptions))
        if (user.banner) embed.setImage(user.bannerURL(imgURLOptions))

        const embeds = [embed]

        command.followUp({ embeds }).catch(console.error)
    },
})
