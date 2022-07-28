import { coin } from "../../config"
import { depositAll } from "../../functions/dataBase/bank"
import { followUp } from "../../functions/discord/message"
import { SubCommand } from "../../structures/SubCommand"

export default new SubCommand("all", async (command) => {
    const { amount } = await depositAll(command.user.id)

    followUp(command, `Deposited total ${amount} ${coin}`)
})
