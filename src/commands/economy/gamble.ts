import { coin, economy } from "../../config"
import { getUserData } from "../../functions/userDB/getData"
import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "gamble",
    description: "Gamble your money.",
    options: [
        {
            type: "INTEGER",
            name: "coins",
            description: "How much you want to gamble?",
            required: true,
        },
    ],
    async execute(command) {
        const amount = command.options.getInteger("coins")

        const userData = await getUserData(command.user.id)

        if (userData.coin < amount) return followUp(command, `You don't have enough money to gamble!`)
        if (1000 > amount) return followUp(command, `You must gamble minimum 1000 ${coin}!`)

        const win = Math.round(Math.random())

        if (!win) {
            userData.coin -= amount
            userData.quickSave(command.client)
            return followUp(command, `You have lost ${amount} ${coin} in the gamble.`, null, "RED")
        }

        const winAmount = amount - amount * economy.tax
        userData.coin += winAmount

        userData.quickSave(command.client)

        followUp(command, `You have win **${winAmount + amount}** ${coin} from the gamble. 🎉`)
    },
})
