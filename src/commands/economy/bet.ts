import { coin, economy } from "../../config"
import { getUserData } from "../../functions/userDB/getData"
import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"
import { writeCoin } from "../../functions/string/writeCoins"
import { addCoin } from "../../functions/userDB/coin"

export default new Command({
    name: "bet",
    description: "bet your coins to earn more.",
    options: [
        {
            type: "INTEGER",
            name: "coins",
            description: "How much you want to bet?",
            required: true,
        },
    ],
    async execute(command) {
        const amount = command.options.getInteger("coins")

        const userData = await getUserData(command.user.id)

        if (userData.coin < amount) return command.followUp(`You don't have enough money to bet!`)
        if (1e3 > amount || amount > 1e6)
            return command.followUp(`The bet amount must be between ${writeCoin(1e3)} - ${writeCoin(1e6)}!`)

        const win = Math.round(Math.random())

        if (!win) {
            addCoin(userData, -amount)
            return followUp(command, `You have lost ${amount} ${coin} in the bet.`, null, "RED")
        }

        const winAmount = Math.round(amount - amount * economy.tax)
        addCoin(userData, winAmount)

        command.followUp(`You have win ${writeCoin(winAmount + amount)} from the bet. 🎉`)
    },
})
