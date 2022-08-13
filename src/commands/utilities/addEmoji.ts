import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "emoji",
    description: "Manage server emojis.",
    options: [
        {
            type: "SUB_COMMAND",
            name: "add",
            description: "Add an emoji to the server",
            options: [
                {
                    type: "STRING",
                    name: "url",
                    description: "URL of the emoji.",
                    required: true,
                },
                {
                    type: "STRING",
                    name: "name",
                    description: "Name of the emoji.",
                    required: true,
                },
            ],
        },
    ],
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "MANAGE_EMOJIS_AND_STICKERS"],
    async execute(command) {
        const { options, guild } = command
        const URL = options.getString("url")
        const name = options.getString("name")

        const emoji = await guild.emojis.create(URL, name).catch(console.error)
        if (!emoji) return followUp(command, `Failed to add the emoji.`)

        followUp(command, `Emoji has been added to the server. ${emoji}`)
    },
})
