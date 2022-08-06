import { coin } from "../../config"
import { deposit } from "../../functions/userDB/bank"
import { followUp } from "../../functions/discord/message"
import { SubCommand } from "../../structures/SubCommand"

export default new SubCommand("all", async (command) => {
    const { amount } = await deposit(command.user.id, null, command.client)

    followUp(command, `Deposited total ${amount} ${coin}`)
})
