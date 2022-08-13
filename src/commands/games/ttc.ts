import { Command } from "../../structures/Command"
import { Collection, Message, MessageActionRow, MessageButton, MessageButtonStyle, MessageEmbed } from "discord.js"
import { followUp, interactionReply } from "../../functions/discord/message"
import { color } from "../../config"
import { logError } from "../../functions/log/logger"

export default new Command({
    name: "tic-tac-toe",
    description: "Play tic tac toe with someone.",
    options: [
        {
            type: 6,
            name: "opponent",
            description: "The user you want to play with.",
            required: true,
        },
    ],
    aliases: ["ttt"],
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
    async execute(command) {
        const challenger = command.user
        const opponent = command.options.getUser("opponent")
        if (challenger === opponent) return followUp(command, `You can't play with yourself.`)
        if (opponent.bot) return followUp(command, "Nah. You can't play with bot.")

        let defaultEmoji = "⬛"

        const button = (label: string, style: MessageButtonStyle, customId: string) =>
            new MessageButton().setLabel(label).setStyle(style).setCustomId(customId)

        let components: MessageActionRow[] = [
            new MessageActionRow().addComponents(
                button(defaultEmoji, "SECONDARY", "1"),
                button(defaultEmoji, "SECONDARY", "2"),
                button(defaultEmoji, "SECONDARY", "3"),
            ),

            new MessageActionRow().addComponents(
                button(defaultEmoji, "SECONDARY", "4"),
                button(defaultEmoji, "SECONDARY", "5"),
                button(defaultEmoji, "SECONDARY", "6"),
            ),

            new MessageActionRow().addComponents(
                button(defaultEmoji, "SECONDARY", "7"),
                button(defaultEmoji, "SECONDARY", "8"),
                button(defaultEmoji, "SECONDARY", "9"),
            ),
        ]

        const title = `<@${challenger.tag}> VS <@${opponent.tag}>`
        let embeds = [new MessageEmbed().setColor(color).setDescription(`It's ${opponent}'s turn.`).setTitle(title)]
        const message = (await command.followUp({ components, embeds })) as Message

        let currentPlayer = opponent.id
        let currentTeam = "❌"

        const collector = message.createMessageComponentCollector({ idle: 30 * 1000 })

        const collected: Collection<string, any> = collector.collected

        collector.on("collect", async (interaction) => {
            if (interaction.user.id !== currentPlayer) {
                collector.collected.delete(interaction.id)
                return interactionReply(interaction, "It's not your turn.", true)
            }
            if (interaction.user.id !== challenger.id && interaction.user.id !== currentPlayer) {
                collector.collected.delete(interaction.id)
                return interactionReply(interaction, "Who the are you? If you want play start your own game?", true)
            }
            interaction.deferUpdate()

            let currentUserButtons =
                collector.collected
                    .filter((item) => item.user.id === currentPlayer)
                    .map((item) => parseInt(item.customId)) || []

            let winner = false

            const solution = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
                [1, 4, 7],
                [2, 5, 8],
                [3, 6, 9],
                [1, 5, 9],
                [3, 5, 7],
            ]

            solution.forEach((win) =>
                currentUserButtons.filter((x) => win.includes(x)).length === 3 ? (winner = true) : null,
            )

            const row = Math.floor((parseInt(interaction.customId) - 1) / 3)

            interaction.message.components[row].components.forEach((btn) => {
                if (btn.customId === interaction.customId) {
                    btn.disabled = true
                    btn.label = currentTeam
                    btn.style = currentTeam === "❌" ? "DANGER" : "SUCCESS"
                }
            })

            components = interaction.message.components as any

            if (winner) {
                collected.set("result", "win")

                interaction.message.components.forEach((x) => x.components.forEach((y) => (y.disabled = true)))

                components = interaction.message.components as any

                embeds = [
                    new MessageEmbed()
                        .setColor(color)
                        .setTitle(title)
                        .setDescription(`<@${currentPlayer}> is the winner. 🎉`),
                ]

                return message.edit({ components, embeds }).catch(logError) as any
            }

            currentPlayer = currentPlayer === opponent.id ? challenger.id : opponent.id
            currentTeam = currentTeam === "❌" ? "⭕" : "❌"
            embeds = [
                new MessageEmbed().setColor(color).setTitle(title).setDescription(`It's <@${currentPlayer}>'s turn.`),
            ]
            if (collected.size === 9) {
                collected.set("result", "tie")
                embeds = [new MessageEmbed().setColor(color).setTitle(title).setDescription(`Tie`)]
            }

            message.edit({ components, embeds }).catch(logError)
        })

        collector.on("end", async () => {
            setTimeout(async () => {
                if (collected.last() === "win" || collected.last() === "tie") return
                components.forEach((row) => row.components.forEach((box) => (box.disabled = true)))

                embeds = [new MessageEmbed().setColor(color).setTitle(title).setDescription(`Game time over.`)]
                message.edit({ components, embeds }).catch(logError)
            }, 1000)
        })
    },
})
