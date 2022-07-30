import { MessageEmbed } from "discord.js"
import { color } from "../../config"
import { getEmbed } from "../../functions/discord/getEmbed"
import { Command } from "../../structures/Command"

export default new Command({
    name: "help",
    description: "Get a list of all commands.",
    async execute(command) {
        const embeds = [
            getEmbed(command).setDescription(
                command.client.commands
                    .filter((x) => !x.devOnly)
                    .map(({ name }) => `\`${name}\``)
                    .join(", "),
            ),
        ]
        command.followUp({ embeds }).catch(console.error)
    },
})
