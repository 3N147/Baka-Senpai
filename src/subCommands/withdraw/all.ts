import { coin } from "../../config"
import { followUp } from "../../functions/discord/message"
import { withdraw } from "../../functions/userDB/bank"
import { SubCommand } from "../../structures/SubCommand"

export default new SubCommand("all", async (command) => {
    const { amount } = await withdraw(command.user.id, null, command.client)

    followUp(command, `Withdraw total ${amount} ${coin}`)
})
