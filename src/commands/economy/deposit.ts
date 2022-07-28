import { client } from "../.."
import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "deposit",
    description: "Deposit money.",
    options: [
        {
            type: 1,
            name: "amount",
            description: "The amount of money to deposit.",
            options: [
                {
                    type: 4,
                    name: "amount",
                    description: "Amount of money you want to deposit.",
                    required: true,
                },
            ],
        },
        {
            type: 1,
            name: "all",
            description: "Deposit all money to the bank.",
        },
    ],
    async execute(command) {
        const commandName = command.options.getSubcommand()
        const group = client.subCommands.get(`deposit`)

        if (!group) return followUp(command, `Invalid Command.`)
        const subcommand = group.get(commandName)

        if (!subcommand) return followUp(command, `Invalid Command.`)

        try {
            subcommand(command)
        } catch (error) {
            console.error(error)
        }
    },
})
