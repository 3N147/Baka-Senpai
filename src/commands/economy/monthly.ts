import { coin } from "../../config"
import { getUserData } from "../../functions/userDB/getData"
import { getDynamicTime } from "../../functions/discord/getDynamicTime"
import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"
import { addCoin } from "../../functions/userDB/coin"

export default new Command({
    name: "monthly",
    description: "Get fixed amount of coin every month.",
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
    async execute(command) {
        const userData = await getUserData(command.user.id)

        const currentTime = new Date().valueOf()
        const { monthly } = userData

        const MONTH = 1000 * 60 * 60 * 24 * 30 // a month in ms
        const nextDay = monthly.time.valueOf() + MONTH

        if (currentTime - monthly.time.valueOf() < MONTH) {
            const time = getDynamicTime(nextDay, "RELATIVE")
            return command.followUp(`You can't use this command now.\nYou'll be able to use this command ${time}.`)
        }

        userData.monthly.time = new Date()
        addCoin(userData, monthly.amount)

        followUp(command, `You got **${monthly.amount}** ${coin} from monthly.`)
    },
})
