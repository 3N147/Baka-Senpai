import { coin } from "../../config"
import { addCoin } from "../../functions/dataBase/coin"
import { getUserData } from "../../functions/dataBase/getData"
import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "beg",
    description: `Beg money from a rich person.`,
    async execute(command) {
        const { id } = command.user

        if (Math.floor(Math.random() * 10) < 3) return followUp(command, `Got nothing from begging. Poor beggar.`)

        const randomCoin = Math.floor(Math.random() * 500)

        await addCoin(id, randomCoin)

        followUp(command, `Your earned **${randomCoin}** ${coin} from begging.`)
    },
})
