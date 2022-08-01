import { coin } from "../../config"
import { addCoin } from "../../functions/userDB/coin"
import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "beg",
    description: `Beg money from a rich person.`,
    async execute(command) {
        const { id } = command.user

        if (Math.floor(Math.random() * 10) < 3) return followUp(command, `You got nothing from begging. Poor beggar!`)

        const randomCoin = Math.round(Math.random() * 500)

        await addCoin(id, randomCoin, command.client)

        followUp(command, `Your earned **${randomCoin}** ${coin} from begging.`)
    },
})
