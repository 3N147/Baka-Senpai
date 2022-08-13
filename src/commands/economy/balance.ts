import { coin, waitTime } from "../../config"
import { getUserData } from "../../functions/userDB/getData"
import { followUp, interactionReply } from "../../functions/discord/message"
import { Command } from "../../structures/Command"
import { getEmbed } from "../../functions/discord/getEmbed"
import { writeCoin } from "../../functions/string/writeCoins"
import { createButton, createRow } from "../../functions/discord/components"
import { Message } from "discord.js"
import { deposit, withdraw } from "../../functions/userDB/bank"
export default new Command({
    name: "balance",
    description: "Check balance.",
    options: [
        {
            type: "USER",
            name: "user",
            description: "Check balance of someone.",
            required: false,
        },
    ],
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
    async execute(command) {
        const userId = command.options.getUser("user")?.id || command.user.id

        const userData = await getUserData(userId)

        const { coin, bank } = userData

        const description = [
            `Coin: ${writeCoin(coin)}`,
            `Bank: ${writeCoin(bank)}`,
            `Net: ${writeCoin(coin + bank)}`,
        ].join("\n")

        const embeds = [getEmbed(command).setDescription(description)]

        const components = [
            createRow(createButton("Deposit All", "dep", "SUCCESS"), createButton("Withdraw All", "with", "SUCCESS")),
        ]

        const message = (await command.followUp({ components, embeds })) as Message

        if (!message) return

        const button = await message.awaitMessageComponent({ time: waitTime }).catch(() => null)

        if (!button) return

        if (button.customId === "with") {
            const { amount } = await withdraw(userData, null)
            message.edit({ components: [] })
            return interactionReply(
                button,
                `All coins have been withdrawn from the bank. Amount: ${writeCoin(amount)}`,
                true,
            )
        }

        const { amount } = await deposit(userData, null)

        message.edit({ components: [] })

        return interactionReply(button, `All coins have been deposited to the bank. Amount: ${writeCoin(amount)}`, true)
    },
})
