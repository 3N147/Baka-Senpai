import { Message, MessageActionRow, MessageButton, MessageButtonStyle, MessageEmbed } from "discord.js"
import { coin, color } from "../../config"
import { addCoin } from "../../functions/dataBase/coin"
import { interactionReply } from "../../functions/discord/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "search-coin",
    description: "Search Coin somewhere to get some coin.",
    async execute(command) {
        const { user } = command

        const button = (label: string, style: MessageButtonStyle, customId: string) =>
            new MessageButton().setLabel(label).setStyle(style).setCustomId(customId)

        let wood = button(`Wood`, `SUCCESS`, `wood`)
        let bush = button(`Bush`, `SUCCESS`, `bush`)
        let bed = button(`Bed`, `SUCCESS`, `bed`)
        let jungle = button(`Jungle`, `SUCCESS`, `jungle`)
        let water = button(`Water`, `SUCCESS`, `water`)
        let internet = button(`Internet`, `SUCCESS`, `internet`)
        let book = button(`Book`, `SUCCESS`, `book`)

        let buttons = [wood, bush, bed, jungle, water, internet, book]

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
        let embeds = [new MessageEmbed().setColor(color).setDescription("Where do you want to search?")]

        const message = (await command.followUp({ embeds, components }).catch(console.error)) as Message

        const collector = message.createMessageComponentCollector({ time: 60 * 1000 })

        collector.on("collect", async (interaction) => {
            if (interaction.user.id !== user.id) {
                collector.collected.delete(interaction.id)
                return interactionReply(interaction, `I didn't asked you!`, true) as any
            }
            interaction.deferUpdate()

            const place = interaction.customId

            if (Math.floor(Math.random() * 10) < 3) {
                embeds = [new MessageEmbed().setColor(color).setDescription(`Got nothing by searching in ${place}.`)]
                return message.edit({ embeds, components: [] }).catch(console.error)
            }

            const { amount } = await addCoin(user.id, Math.round(Math.random() * 500))

            embeds = [
                new MessageEmbed().setColor(color).setDescription(`You found **${amount}** ${coin} in the ${place}.`),
            ]

            return message.edit({ embeds, components: [] }).catch(console.error)
        })

        collector.on("end", async (collected) => {
            if (collected.size !== 0) return

            buttons.forEach((button) => (button.disabled = true))

            components = [new MessageActionRow().addComponents(buttons)]

            embeds = [new MessageEmbed().setColor(color).setDescription(`I waited enough.`)]

            message.edit({ embeds, components }).catch(console.error)
        })
    },
})
