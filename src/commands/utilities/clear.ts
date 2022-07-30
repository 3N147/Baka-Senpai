import { Command } from "../../structures/Command"
import { Message, MessageActionRow, TextChannel } from "discord.js"
import { getEmbed } from "../../functions/discord/getEmbed"
import { waitTime } from "../../config"
import { timeOut } from "../../functions/discord/timeout"
import { followUp } from "../../functions/discord/message"
import { createButton } from "../../functions/discord/components"

export default new Command({
    name: "clear",
    description: "Clear multiple messages in a channel. ",
    options: [
        {
            type: 4,
            name: "limit",
            description: "You can delete maximum 100 message from a channel",
            required: true,
        },
    ],
    ephemeral: true,
    aliases: ["bulk-delete"],
    async execute(command) {
        let channel = command.channel as TextChannel
        let limit = command.options.getInteger("limit")
        if (limit > 100) return followUp(command, `Limit must be 100 or below!`)
        let messages = await channel.messages.fetch({ limit })

        const getUrl = (message: Message) =>
            `https://discord.com/channels/${message.guild.id}/${message.channelId}/${message.id}`

        const from = messages.last()
        const to = messages.first()

        let embeds = [
            getEmbed(command)
                .setDescription(
                    `Are you sure the you want to delete all of these messages?\n Total messages: ${messages.size}`,
                )
                .addField(`From: Message by ${from.author.tag}`, (from.content ?? "") + `\n[Jump](${getUrl(from)})`)
                .addField(`To: Message by ${to.author.tag}`, (to.content ?? "") + `\n[Jump](${getUrl(to)})`),
        ]

        const components = [
            new MessageActionRow().setComponents(
                createButton("Just do it", "ok", "DANGER"),
                createButton("Never mind.", "no"),
            ),
        ]

        const message = (await command.followUp({ embeds, components }).catch(console.error)) as Message
        if (!message) return
        const button = await message.awaitMessageComponent({ idle: waitTime })
        if (!button) return

        if (button.customId === "no") return timeOut("DENY", { interaction: command })

        await channel.bulkDelete(messages).catch(console.error)

        embeds = [getEmbed(command).setDescription("Messages has been deleted.")]

        command.editReply({ embeds, components: [] }).catch(console.error)
    },
})
