import { client } from "../.."
import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "self-role",
    description: "Create a new self role message.",
    options: [
        {
            type: "SUB_COMMAND",
            name: "quick-setup",
            description: "Quick setup a self-role message.",
            options: [
                {
                    type: "STRING",
                    name: "title",
                    description: "Title of the embed.",
                    required: true,
                },
                {
                    type: "CHANNEL",
                    name: "channel",
                    channelTypes: ["GUILD_TEXT", "GUILD_NEWS"],
                    description: "Target channel to send self-role message.",
                    required: true,
                },
                {
                    type: "INTEGER",
                    name: "limit",
                    description: "Maximum number of role member can take from this message.",
                },
            ],
        },
    ],
    permissions: ["MANAGE_ROLES"],
    ephemeral: true,
    async execute(command) {
        const { options } = command
        const commandName =
            (options?.getSubcommandGroup(false) ? `${options?.getSubcommandGroup(false)}-` : "") +
            options.getSubcommand()
        const group = client.subCommands.get(`self-role`)

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
