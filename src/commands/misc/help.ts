import { MessageEmbed } from "discord.js"
import { color } from "../../config"
import { Command } from "../../structures/Command"

export default new Command({
    name: "help",
    description: "Get a list of all commands.",
    // aliases: ["commands"],
    async execute(command) {
        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .setDescription("string")
                .setTitle("Title")
                .setImage("www.image.com/imageurl/none.png"),
        ]
        command.followUp({ embeds }).catch(console.error)
    },
})
