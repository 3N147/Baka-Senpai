import { writeCoin } from "../../functions/string/writeCoins"
import { withdraw } from "../../functions/userDB/bank"
import { Command } from "../../structures/Command"

export default new Command({
    name: "withdraw",
    description: "withdraw money.",
    options: [
        {
            type: 1,
            name: "amount",
            description: "The amount of money to withdraw.",
            options: [
                {
                    type: 4,
                    name: "amount",
                    description: "Amount of money you want to withdraw.",
                    required: true,
                },
            ],
        },
        {
            type: 1,
            name: "all",
            description: "Withdraw all money to the bank.",
        },
    ],
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
    async execute(command) {
        const userAmount = command.options.getInteger("amount")

        if (userAmount === 0) return command.followUp("Why you want to withdraw 0 coin.")

        const { amount } = await withdraw(command.user.id, userAmount)

        command.followUp(`Withdraw total ${writeCoin(amount)}`)
    },
})
