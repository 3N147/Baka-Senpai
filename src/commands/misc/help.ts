import { EmbedFieldData } from "discord.js"
import { getEmbed } from "../../functions/discord/getEmbed"
import { Command } from "../../structures/Command"

export default new Command({
    name: "help",
    description: "Get a list of all commands.",
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
    async execute(command) {
        const commands = command.client.commands.filter((cmd) => !cmd.devOnly)

        const categories = Array.from(new Set(commands.map((x) => x.category)))

        const fields: EmbedFieldData[] = categories.map((cate) => {
            const commandList = commands
                .filter((cmd) => cmd.category === cate && !cmd.aliases?.includes(cmd.name))
                .map(({ name }) => `\`${name}\``)

            return { name: cate, value: commandList.join(" ") || `** **` }
        })

        const embeds = [getEmbed(command).setTitle("Here is the list of the commands.").setFields(fields)]
        command.followUp({ embeds })
    },
})
