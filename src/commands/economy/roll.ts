import { ButtonInteraction, Message, MessageButtonStyle, UserManager } from "discord.js"
import { economy, emojis, waitTime } from "../../config"
import { collectorFilter } from "../../functions/discord/collectorFilter"
import { createButton, createRow } from "../../functions/discord/components"
import { getEmbed } from "../../functions/discord/getEmbed"
import { logError } from "../../functions/log/logger"
import { writeCoin } from "../../functions/string/writeCoins"
import { addCoin } from "../../functions/userDB/coin"
import { Command } from "../../structures/Command"

export default new Command({
    name: "roll",
    description: "Roll dice with me.",
    async execute(command) {
        const { user, client } = command

        const amount = 1000

        const dices = emojis.dices

        const dice = "🎲"
        const components = [
            createRow(createButton(null, "my_dice_1", "SECONDARY", true, dice)),
            createRow(createButton(null, "user_dice_1", "SECONDARY", false, dice)),
        ]

        function roll() {
            const index = Math.floor(Math.random() * 6)
            const score = index + 1
            return [index, score]
        }

        let description = `Click the button to roll dice.`
        let embeds = [getEmbed(command).setDescription(description)]

        const message = (await command.followUp({ components, embeds }).catch(logError)) as Message

        if (!message) return

        const filter = (i: ButtonInteraction) => collectorFilter(i, user)

        let userScore = 0
        let myScore = 0
        let rollCount = 0

        const collector = message.createMessageComponentCollector({ idle: waitTime, filter })

        collector.on("collect", async (interaction: ButtonInteraction): Promise<any> => {
            const max = components[0].components.length === 5

            interaction.deferUpdate()
            const [myIndex, myNewScore] = roll()
            const [userIndex, userNewScore] = roll()
            let myButtonStyle: MessageButtonStyle = myNewScore > userNewScore ? "SUCCESS" : "DANGER"
            let userButtonStyle: MessageButtonStyle = myNewScore < userNewScore ? "SUCCESS" : "DANGER"

            if (myNewScore === userNewScore) {
                myButtonStyle = "PRIMARY"
                userButtonStyle = "PRIMARY"
            }

            let diceName = `my_dice_${rollCount + 1}`
            let newDiceName = `my_dice_${rollCount + 2}`
            myScore += myNewScore
            components[0].components[rollCount] = createButton(null, diceName, myButtonStyle, true, dices[myIndex])
            if (!max) components[0].components.push(createButton(null, newDiceName, "SECONDARY", true, dice))

            diceName = `user_dice_${rollCount + 1}`
            newDiceName = `user_dice_${rollCount + 2}`
            userScore += userNewScore
            components[1].components[rollCount] = createButton(null, diceName, userButtonStyle, true, dices[userIndex])
            if (!max) components[1].components.push(createButton(null, newDiceName, "SECONDARY", false, dice))

            description = `${client.user.username}: **${myScore}**\n${user.username}: **${userScore}**`

            rollCount++

            if (rollCount === 5) {
                const win = Math.min(myScore, userScore) < userScore
                description += win ? `\n${user.tag} won ${writeCoin(amount)}.` : `\n${user.tag} lost the game!`
                embeds = [
                    getEmbed(command)
                        .setDescription(description)
                        .setColor(win ? "#00ff00" : "#ff0000"),
                ]
                if (win) addCoin(user.id, amount)
                return message.edit({ components, embeds })
            }

            embeds = [getEmbed(command).setDescription(description)]
            message.edit({ components, embeds })
        })

        collector.on("end", (): any => (rollCount === 5 ? null : message.edit({ components: [] })))
    },
})
