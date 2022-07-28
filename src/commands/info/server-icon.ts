import { Command } from "../../structures/Command"

export default new Command({
    name: "server-icon",
    description: "Get sever icon.",
    options: [],
    ephemeral: true,
    async execute(command) {
        command.followUp(command.guild.iconURL({ size: 4096 })).catch(console.error)
    },
})
