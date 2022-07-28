import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"
import { randomNumber } from "../../functions/string/randomNumber"
import { developers } from "../../config"

export default new Command({
    name: "cool-rate",
    description: "Check 100% accurate cool rate.",
    options: [
        {
            type: 6,
            name: "user",
            description: "The cool user. (Hopefully)",
            required: false,
        },
    ],
    async execute(command) {
        const user = command.options.getUser("user") || command.user

        if (developers.includes(user.id)) return followUp(command, `${command.user} is the coolest person.`)

        const rating = randomNumber(user, "coolrate")

        const des = Math.floor(rating / 10)

        let message: string

        switch (des) {
            case 10:
                message = `${user} is the one of the coolest guy I ever meet. Cool Rate: **${rating}%**`
                break
            case 9:
                message = `${user} is supper cool. Cool Rate: **${rating}%**`
                break
            case 8:
                message = `${user} is as cool as I am. Cool Rate: **${rating}%**`
                break
            case 7:
                message = `${user} is cool. Cool Rate: **${rating}%**`
                break
            case 6:
                message = `${user} is cooler than average person. Cool Rate: **${rating}%**`
                break
            case 5:
                message = `${user} is an average person. Cool Rate: **${rating}%**`
                break
            case 4:
                message = `${user} is less cooler than an average person. Cool Rate: **${rating}%**`

                break
            case 3:
                message = `Checking ${user}'s cool rate was a mistake. Cool Rate: **${rating}%**`
                break
            case 2:
                message = `${user} is not cool at all. Cool Rate: **${rating}%**`
                break
            case 1:
                message = `Cool Rate: **${rating}%**. Happy?`
                break
            case 0:
                message = `Silence for ${user}... Cool Rate: **${rating}%**`
                break
        }

        return followUp(command, message)
    },
})
