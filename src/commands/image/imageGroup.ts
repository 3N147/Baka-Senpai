import { Command } from "../../structures/Command"
import { followUp } from "../../functions/discord/message"
import { client } from "../.."

export default new Command({
    name: "image",
    description: "Image related fun stuff.",
    options: [
        {
            type: 1,
            name: "trigger",
            description: "Trigger someone.",
            options: [
                {
                    type: 6,
                    name: "user",
                    description: "Target user to trigger.",
                    required: true,
                },
            ],
        },
        {
            type: 1,
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
        },
        {
            type: 1,
            name: "rainbow",
            description: "Check rainbow rate....",
            options: [
                {
                    type: 6,
                    name: "user",
                    description: "The target user.",
                    required: true,
                },
            ],
        },
        {
            type: 1,
            name: "brain",
            description: "Good old brain meme",
            options: [
                {
                    type: 3,
                    name: "smallest",
                    description: "Small",
                    required: true,
                },
                {
                    type: 3,
                    name: "small",
                    description: "Small",
                    required: true,
                },
                {
                    type: 3,
                    name: "big",
                    description: "big",
                    required: true,
                },
                {
                    type: 3,
                    name: "biggest",
                    description: "Biggest",
                    required: true,
                },
            ],
        },
        {
            type: 1,
            name: "delete",
            description: "Delete someone.",
            options: [
                {
                    type: 6,
                    name: "user",
                    description: "The target user.",
                    required: true,
                },
            ],
        },
    ],
    async execute(command) {
        const commandName = command.options.getSubcommand()
        const group = client.subCommands.get(`image`)

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
