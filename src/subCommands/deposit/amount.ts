import { coin } from "../../config"
import { depositAmount } from "../../functions/dataBase/bank"
import { followUp } from "../../functions/discord/message"
import { SubCommand } from "../../structures/SubCommand"

export default new SubCommand("amount", async (command) => {
    depositAmount(command.user.id, command.options.getNumber("amount"))
        .then(({ amount }) => followUp(command, `Deposited total ${amount} ${coin}`))
        .catch(() => followUp(command, `You don't have enough money to deposit.`))
})
