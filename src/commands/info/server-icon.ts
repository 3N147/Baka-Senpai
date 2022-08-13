import { Command } from "../../structures/Command"

export default new Command({
    name: "servericon",
    description: "Get sever icon.",
    options: [],
    ephemeral: true,
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
    async execute(command) {
        command.followUp(command.guild.iconURL({ size: 4096 }))
    },
})
