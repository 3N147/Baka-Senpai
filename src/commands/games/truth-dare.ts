import { dare, truth } from "../../data/truthAndDare"
import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "dare",
    description: "Get an interesting truth or dare.",
    aliases: ["truth"],
    async execute(command) {
        return command.commandName === "dare"
            ? followUp(command, `> ${dare[Math.floor(Math.random() * dare.length)]}`)
            : followUp(command, `> ${truth[Math.floor(Math.random() * truth.length)]}`)
    },
})
