import { coin } from "../../config"
import { followUp } from "../../functions/discord/message"
import { deposit } from "../../functions/userDB/bank"
import { SubCommand } from "../../structures/SubCommand"

export default new SubCommand("amount", async (command) => {
    deposit(command.user.id, command.options.getNumber("amount"), command.client)
        .then(({ amount }) => followUp(command, `Deposited total ${amount} ${coin}`))
        .catch(() => followUp(command, `You don't have enough money to deposit.`))
})
