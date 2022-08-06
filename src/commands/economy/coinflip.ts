import { ButtonInteraction, Message } from "discord.js"
import { economy, emojis, waitTime } from "../../config"
import { collectorFilter } from "../../functions/discord/collectorFilter"
import { createButton, createRow } from "../../functions/discord/components"
import { followUp } from "../../functions/discord/message"
import { timeOut } from "../../functions/discord/timeout"
import { toggleAnswerComponents } from "../../functions/discord/toggleComponents"
import { writeCoin } from "../../functions/string/writeCoins"
import { getUserData } from "../../functions/userDB/getData"
import { Command } from "../../structures/Command"

export default new Command({
    name: "coinflip",
    description: "Flip a coin.",
    options: [
        {
            type: "INTEGER",
            name: "bet",
            description: "How much do you want to bet.",
            required: true,
        },
    ],
    async execute(command) {
        const { options, user, client } = command

        const bet = options.getInteger("bet")

        const userData = await getUserData(user.id)

        userData.coin -= bet

        if (userData.coin < bet) return followUp(command, `You don't have enough coins in your wallet!`)

        let components = [
            createRow(
                createButton("Head", "head", "SUCCESS", false, emojis.head),
                createButton("Tail", "tail", "PRIMARY", false, emojis.tail),
            ),
            createRow(createButton("Gimme my coins back!", "return", "DANGER", false, "💰")),
        ]

        let content = `<a:lol:${emojis.coinFlip}>`

        const message = (await command.followUp({ content, components }).catch(console.error)) as Message

        if (!message) return

        const filter = (inter: ButtonInteraction) => collectorFilter(inter, user)

        const button = await message.awaitMessageComponent({ time: waitTime, filter })

        if (!button) {
            userData.quickSave(client)
            return timeOut("NOREPLY", { message })
        }

        button.deferUpdate()

        if (button.customId === "return") {
            userData.coin += bet
            userData.quickSave(client)
            return timeOut("DISABLE", { message }, components)
        }

        const side = Math.round(Math.random()) ? "head" : "tail"

        const choice = button.customId

        const emoji = `<:heheboi:${choice === "head" ? emojis.head : emojis.tail}>`

        if (side === choice) {
            content = `You choose ${emoji} and you won ${writeCoin(bet * 2 - bet * economy.tax)}. 🎉`
            components = [toggleAnswerComponents(components, choice, side)[0]]

            userData.coin += bet * 2 - bet * economy.tax
            userData.quickSave(client)

            return message.edit({ components, content }).catch(console.error)
        }

        content = `You choose ${emoji} and you lost ${writeCoin(bet)}.`
        components = [toggleAnswerComponents(components, choice, side)[0]]

        userData.quickSave(client)

        return message.edit({ components, content }).catch(console.error)
    },
})
