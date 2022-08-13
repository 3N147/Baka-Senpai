import { writeCoin } from "../../functions/string/writeCoins"
import { deposit } from "../../functions/userDB/bank"
import { Command } from "../../structures/Command"

export default new Command({
    name: "deposit",
    description: "Deposit money.",
    options: [
        {
            type: 1,
            name: "amount",
            description: "The amount of money to deposit.",
            options: [
                {
                    type: 4,
                    name: "amount",
                    description: "Amount of money you want to deposit.",
                    required: true,
                },
            ],
        },
        {
            type: 1,
            name: "all",
            description: "Deposit all money to the bank.",
        },
    ],
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
    async execute(command) {
        const userAmount = command.options.getInteger("amount")

        if (userAmount === 0) return command.followUp(`Bank is too busy to deposit 0 coins.`)

        const { amount } = await deposit(command.user.id, userAmount)

        command.followUp(`Deposited total ${writeCoin(amount)}.`)
    },
})
