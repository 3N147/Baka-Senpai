import { coin } from "../../config"
import { withdrawAmount } from "../../functions/userDB/bank"
import { followUp } from "../../functions/discord/message"
import { SubCommand } from "../../structures/SubCommand"

export default new SubCommand("amount", async (command) => {
    withdrawAmount(command.user.id, command.options.getNumber("amount"), command.client)
        .then(({ amount }) => followUp(command, `Withdrawn total ${amount} ${coin}`))
        .catch(() => followUp(command, `You don't have enough money to withdraw.`))
})
