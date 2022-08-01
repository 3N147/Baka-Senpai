import { developers } from "../../config"
import { followUp } from "../../functions/discord/message"
import { randomNumber } from "../../functions/random/random"
import { Command } from "../../structures/Command"

export default new Command({
    name: "pp",
    description: "The measuring machine",
    options: [
        {
            type: "USER",
            name: "user",
            description: "The target user to measure.",
            required: false,
        },
    ],
    async execute(command) {
        const user = command.options.getUser("user") ?? command.user
        let num = randomNumber(user, "peeeeppeeeeeeeeee", 0, 10)

        if (developers.includes(user.id)) num = 11

        let content = `8`

        for (let i = 0; i < num; i++) {
            content += "="
        }

        content += "D"

        followUp(command, `${user}'s penis\n${content}`)
    },
})
