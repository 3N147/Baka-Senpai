import { coin } from "../../config"
import { depositAll } from "../../functions/userDB/bank"
import { followUp } from "../../functions/discord/message"
import { SubCommand } from "../../structures/SubCommand"

export default new SubCommand("all", async (command) => {
    const { amount } = await depositAll(command.user.id, command.client)

    followUp(command, `Deposited total ${amount} ${coin}`)
})
