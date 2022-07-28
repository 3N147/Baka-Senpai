import { coin } from "../../config"
import { withdrawAll } from "../../functions/dataBase/bank"
import { followUp } from "../../functions/discord/message"
import { SubCommand } from "../../structures/SubCommand"

export default new SubCommand("all", async (command) => {
    const { amount } = await withdrawAll(command.user.id)

    followUp(command, `Withdraw total ${amount} ${coin}`)
})
