import { Message } from "discord.js"
import { waitTime } from "../../config"
import { truth } from "../../data/truthAndDare"
import { createButton, createModalComponents, createRow } from "../../functions/discord/components"
import { getEmbed } from "../../functions/discord/getEmbed"
import { getRandomItem } from "../../functions/random/random"
import { Command } from "../../structures/Command"
import { ExtendedButton } from "../../typings/Components"

export default new Command({
    name: "truth",
    description: "Get an interesting truth.",
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "MANAGE_MESSAGES"],
    async execute(command) {
        const str = `**Question:**\n*${getRandomItem(truth)}*`

        const embeds = [getEmbed(command).setDescription(str)]
        const components = [
            createRow(createButton("Stop", "stop", "DANGER"), createButton("Start New", "truth", "SUCCESS")),
        ]

        const message = (await command.followUp({ embeds, components })) as Message

        const messageFilter = (message: Message) => !message.author.bot && !collected(message.author.id)

        const limit = 10

        const collected = (userId: string) => messageCollector.collected.some((x) => x.author.id === userId)

        const buttonCollector = message.createMessageComponentCollector({
            idle: waitTime,
            max: limit,
        })

        const messageCollector = message.channel.createMessageCollector({
            idle: waitTime,
            max: limit,
            filter: messageFilter,
        })

        const stop = () => {
            buttonCollector.stop()
            messageCollector.stop()
        }

        buttonCollector.on("collect", async (button: ExtendedButton) => {
            stop()
            if (button.customId === "truth") return
            button.deferUpdate()
        })

        messageCollector.on("collect", async (msg) => {
            buttonCollector.resetTimer()

            msg.delete()
            const input = msg.content

            embeds[0].addField(`${msg.member.displayName}'s answer:`, input)

            message.edit({ embeds })

            if (messageCollector.collected.size === limit) stop()
        })

        buttonCollector.on("end", (): any => message.edit({ components: [] }))
    },
})
