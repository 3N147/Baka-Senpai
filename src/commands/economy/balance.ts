import { coin } from "../../config"
import { getUserData } from "../../functions/dataBase/getData"
import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"
export default new Command({
    name: "balance",
    description: "Check balance.",
    options: [
        {
            type: 6,
            name: "user",
            description: "For someone else.",
            required: false,
        },
    ],
    async execute(command) {
        const userId = command.options.getUser("user")?.id || command.user.id

        const userData = await getUserData(userId)

        followUp(command, `Coin: **${userData.coin}** ${coin} Bank: **${userData.bank}** ${coin}`)
    },
})
