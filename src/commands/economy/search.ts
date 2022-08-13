import { Message, MessageActionRow, MessageComponentInteraction } from "discord.js"
import { coin, waitTime } from "../../config"
import { addCoin } from "../../functions/userDB/coin"
import { collectorFilter } from "../../functions/discord/collectorFilter"
import { createButton } from "../../functions/discord/components"
import { getEmbed } from "../../functions/discord/getEmbed"
import { timeOut } from "../../functions/discord/timeout"
import { Command } from "../../structures/Command"
import { logError } from "../../functions/log/logger"

export default new Command({
    name: "search-coin",
    description: "Search Coin somewhere to get some coin.",
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
    async execute(command) {
        const { user } = command

        let buttons = [
            createButton(`Wood`, `wood`),
            createButton(`Bush`, `bush`),
            createButton(`Bed`, `bed`),
            createButton(`Jungle`, `jungle`),
            createButton(`Water`, `water`),
            createButton(`Internet`, `internet`),
            createButton(`Book`, `book`),
            createButton(`Wallet`, `wallet`),
        ]

        function randomizeIndex(array: any[]) {
            if (array.length === 0) return array
            for (let index = 0; index < array.length; index++) {
                let i = Math.floor(Math.random() * array.length)
                let randomItem = array[i]
                array[i] = array[index]
                array[index] = randomItem
            }
            return array
        }

        buttons = randomizeIndex(buttons).slice(0, 3)

        let components = [new MessageActionRow().addComponents(buttons)]
        let embeds = [getEmbed(command).setDescription("Where do you want to search?")]

        const message = (await command.followUp({ embeds, components }).catch(console.error)) as Message

        if (!message) return

        const filter = (interaction: MessageComponentInteraction) => collectorFilter(interaction, command.user)

        const interaction = await message.awaitMessageComponent({ time: waitTime, filter }).catch(logError)

        if (!interaction) return timeOut("TIMEOUT", { message })

        const place = interaction.customId

        if (Math.floor(Math.random() * 10) < 3) {
            embeds = [getEmbed(command).setDescription(`Got nothing by searching in ${place}.`)]
            return message.edit({ embeds, components: [] })
        }

        const { amount } = await addCoin(user.id, Math.round(Math.random() * 500))

        embeds = [getEmbed(command).setDescription(`You found **${amount}** ${coin} in the ${place}.`)]

        return message.edit({ embeds, components: [] })
    },
})
