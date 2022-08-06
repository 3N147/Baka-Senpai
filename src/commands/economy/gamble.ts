import { ButtonInteraction, Message } from "discord.js"
import { economy, waitTime } from "../../config"
import { collectorFilter } from "../../functions/discord/collectorFilter"
import { createButton, createRow } from "../../functions/discord/components"
import { getEmbed } from "../../functions/discord/getEmbed"
import { followUp } from "../../functions/discord/message"
import { randomizeIndex } from "../../functions/random/random"
import { writeCoin } from "../../functions/string/writeCoins"
import { getUserData } from "../../functions/userDB/getData"
import { Command } from "../../structures/Command"

export default new Command({
    name: "gamble",
    description: "Play a gamble with someone to win their coins.",
    options: [
        {
            type: "USER",
            name: "opponent",
            description: "The person you want to play the game with.",
            required: true,
        },
        {
            type: "INTEGER",
            name: "bet",
            description: "How much do you want bet for the game?",
            required: true,
        },
    ],
    async execute(command) {
        const { options, client, user } = command

        const opponent = options.getUser("opponent")
        const bet = options.getInteger("bet")

        if (user.id === opponent.id) return followUp(command, `You can't play with yourself.`)

        const [userData, opponentData] = await Promise.all([getUserData(user.id), getUserData(opponent.id)])

        if (userData.coin < bet) return followUp(command, `You don't have enough coins.`)
        if (opponentData.coin < bet) return followUp(command, `${opponent} doesn't have enough coins.`)

        let embeds = [
            getEmbed(command).setDescription(
                `${user} challenged you do play game for ${writeCoin(bet)}.\nDo you want to play?`,
            ),
        ]

        let components = [createRow(createButton("I'm in", "yes", "SUCCESS"), createButton("No", "no", "DANGER"))]

        const message = (await command.followUp({ components, embeds }).catch(console.error)) as Message

        if (!message) return

        let filter = (button: ButtonInteraction) => collectorFilter(button, opponent)

        const confirmation = (await message
            .awaitMessageComponent({ time: waitTime, filter })
            .catch(console.error)) as ButtonInteraction

        if (!confirmation || confirmation.customId === "no")
            return message.edit({ components: [] }).catch(console.error)

        confirmation.deferUpdate()

        embeds = [getEmbed(command).setDescription("Click the green button as soon as it appears.")]

        await message.edit({ embeds, components: [] }).catch(console.error)

        const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

        let arr = [createButton("❌", "win", "SUCCESS")]

        for (let i = 0; i < 4; i++) {
            arr.push(createButton("⭕", `btn-${i}${i}`))
        }

        components = [createRow(...randomizeIndex(arr))]

        await sleep(5000)

        await message.edit({ components }).catch(console.error)

        filter = (button: ButtonInteraction) => collectorFilter(button, opponent, user)

        const button = (await message
            .awaitMessageComponent({ time: waitTime, filter })
            .catch(console.error)) as ButtonInteraction

        if (!button) {
            const description = [
                `*No reply from the players.*`,
                `${user} lost ${writeCoin(bet)}.`,
                `${opponent} lost ${writeCoin(bet)}.`,
            ].join("\n")

            const embeds = [getEmbed(command).setDescription(description)]

            userData.coin -= bet
            userData.quickSave(client)
            opponentData.coin -= bet
            opponentData.quickSave(client)

            return message.edit({ embeds, components: [] })
        }

        const userClick = button.user.id === user.id
        if (button.customId !== "win") {
            const description = [
                `*You pressed the wrong button*`,
                `${user} lost ${writeCoin(userClick ? bet : 0)}.`,
                `${opponent} lost ${writeCoin(userClick ? 0 : bet)}.`,
            ].join("\n")

            const embeds = [getEmbed(command).setDescription(description)]

            if (userClick) {
                userData.coin -= bet
                userData.quickSave(client)
            } else {
                opponentData.coin -= bet
                opponentData.quickSave(client)
            }
            return message.edit({ embeds, components: [] }).catch(console.error)
        }

        const description = [
            `*${button.user} is the winner.*`,
            `${button.user} won ${writeCoin(bet + (bet - bet * economy.tax))}`,
        ].join("\n")

        embeds = [getEmbed(command).setDescription(description)]

        if (userClick) {
            userData.coin += bet - bet * economy.tax
            userData.quickSave(client)
            opponentData.coin -= bet
            opponentData.quickSave(client)
        } else {
            userData.coin -= bet
            userData.quickSave(client)
            opponentData.coin += bet - bet * economy.tax
            opponentData.quickSave(client)
        }

        return message.edit({ embeds, components: [] }).catch(console.error)
    },
})
