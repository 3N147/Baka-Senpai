import { ButtonInteraction, Message, MessageAttachment } from "discord.js"
import { economy, emojis, waitTime } from "../../config"
import { collectorFilter } from "../../functions/discord/collectorFilter"
import { createButton, createRow } from "../../functions/discord/components"
import { followUp } from "../../functions/discord/message"
import { timeOut } from "../../functions/discord/timeout"
import { toggleAnswerComponents } from "../../functions/discord/toggleComponents"
import { logError } from "../../functions/log/logger"
import { writeCoin } from "../../functions/string/writeCoins"
import { addCoin } from "../../functions/userDB/coin"
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
    aliases: ["toss"],
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "ATTACH_FILES"],
    async execute(command) {
        const { options, user, client } = command

        const bet = options.getInteger("bet")
        const winAmount = Math.round(bet - bet * economy.tax)

        const userData = await getUserData(user.id)

        if (userData.coin < bet) return followUp(command, `You don't have enough coins in your wallet!`)

        let components = [
            createRow(
                createButton("Head", "head", "SUCCESS", false, emojis.head),
                createButton("Tail", "tail", "PRIMARY", false, emojis.tail),
            ),
            createRow(createButton("Gimme my coins back!", "return", "DANGER", false, "💰")),
        ]

        const files = [new MessageAttachment("./assets/images/coinflip.gif", "baka-coinflip.gif")]

        const message = (await command.followUp({ files, components })) as Message

        if (!message) return

        const filter = (inter: ButtonInteraction) => collectorFilter(inter, user)

        const button = (await message
            .awaitMessageComponent({ time: waitTime, filter })
            .catch(logError)) as ButtonInteraction

        if (!button) {
            addCoin(userData, bet)
            return timeOut("NOREPLY", { message })
        }

        button.deferUpdate()

        if (button.customId === "return") {
            return timeOut("DISABLE", { message }, components)
        }

        const side = Math.round(Math.random()) ? "head" : "tail"

        const choice = button.customId

        const emoji = choice === "head" ? emojis.head : emojis.tail

        if (side === choice) {
            const content = `You choose ${emoji} and you won ${writeCoin(winAmount)}. 🎉`
            components = [toggleAnswerComponents(components, choice, side)[0]]

            addCoin(userData, winAmount)

            return message.edit({ components, content, files: [] })
        }

        const content = `You choose ${emoji} and you lost ${writeCoin(bet)}.`
        components = [toggleAnswerComponents(components, choice, side)[0]]

        addCoin(userData, -bet)

        return message.edit({ components, content, files: [] })
    },
})
