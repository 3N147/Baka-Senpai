import { error } from "console"
import {
    ButtonInteraction,
    Collector,
    Interaction,
    Message,
    MessageActionRow,
    MessageButton,
    MessageButtonStyle,
    MessageComponentInteraction,
    MessageEmbed,
    User,
    Collection,
} from "discord.js"
import { color } from "../../config"
import { interactionReply } from "./message"

type optionType = {
    user: User
    embed?: MessageEmbed
    content?: string
    buttonName?: string
    buttonStyle?: MessageButtonStyle
    denyButton?: boolean
    denyButtonName?: string
    input: Message | Interaction
    method: "send" | "followUp" | "reply" | "edit"
    timeOut?: number
    successMessage?: string
    denyMessage?: string
    timeOutMessage?: string
}

export class Confirmation {
    constructor(option: optionType) {
        Object.assign(this, option)
    }

    async start(onConfirm: (Interaction: ButtonInteraction) => any) {
        const option: optionType = this as any
        if (!option.content && !option.embed) throw `You must assign embed or content.`

        const { user, input, method } = option

        const components = [
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId("confirmed")
                    .setStyle(option.buttonStyle || "SUCCESS")
                    .setLabel(option.buttonName || "Sure")
            ),
        ]
        if (option.denyButton) {
            components[0].components.push(
                new MessageButton()
                    .setCustomId("denied")
                    .setStyle("DANGER")
                    .setLabel(option.denyButtonName || "Never Mind!")
            )
        }

        let embeds = option.content
            ? [new MessageEmbed().setColor(color).setDescription(option.content)]
            : [option.embed]

        let message: Message = await input[method]({ embeds, components }).catch(error)

        if (!message) return

        const time = option.timeOut ? option.timeOut * 1000 : 20 * 1000
        const collector: Collector<string, MessageComponentInteraction> = message.createMessageComponentCollector({
            time,
        })

        collector.on("collect", async (interaction: MessageComponentInteraction) => {
            if (interaction.user.id !== user.id) {
                collector.collected.delete(interaction.id)
                return interactionReply(interaction, `I didn't asked you!`, false)
            }

            interaction.deferUpdate()

            if (interaction.customId === "denied") {
                embeds = [
                    new MessageEmbed().setColor(3092790).setDescription(option.denyMessage || "Confirmation denied."),
                ]
                message.components.forEach((row) => row.components.forEach((button) => (button.disabled = true)))
                return message.edit({ content: "", embeds, components: [] }).catch(error) as any
            }

            embeds = [
                new MessageEmbed().setColor(color).setDescription(option.successMessage || `Confirmation Success.`),
            ]

            await message.edit({ embeds, components: [] }).catch(error)

            try {
                onConfirm(interaction as ButtonInteraction)
            } catch (error) {
                console.log(error)
            }
        })

        collector.on("end", async (collection: Collection<string, MessageComponentInteraction>) => {
            if (collection.size !== 0) return

            embeds = [
                new MessageEmbed().setColor(3092790).setDescription(option.timeOutMessage || "Confirmation Timeout."),
            ]
            message.components.forEach((row) => row.components.forEach((button) => (button.disabled = true)))
            message.edit({ content: "", embeds, components: [] }).catch(error)
        })
    }
}
