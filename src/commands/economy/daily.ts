import { coin } from "../../config"
import { getUserData } from "../../functions/userDB/getData"
import { getDynamicTime } from "../../functions/discord/getDynamicTime"
import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "daily",
    description: "Get fixed amount of coin every 24 hour.",
    async execute(command) {
        const userData = await getUserData(command.user.id)

        const currentTime = new Date().valueOf()
        const { daily } = userData

        const day = 24 * 60 * 60 * 1000 // a day in ms
        const nextDay = daily.time.valueOf() + day

        if (currentTime - daily.time.valueOf() < day)
            return followUp(
                command,
                `
                You can't use this command now.
                You'll be able to use this command ${getDynamicTime(nextDay, "RELATIVE")}.
                `,
            )

        userData.xp += daily.amount
        userData.daily.time = new Date()
        userData.quickSave(command.client)

        followUp(command, `You got **${daily.amount}** ${coin} from daily.`)
    },
})
