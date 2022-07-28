import { error } from "console"
import {
    ButtonInteraction,
    ColorResolvable,
    CommandInteraction,
    Message,
    MessageComponentInteraction,
    MessageEmbed,
    ModalSubmitInteraction,
    SelectMenuInteraction,
    TextBasedChannel,
    User,
} from "discord.js"

const defaultColor = "#2f3136"
let embeds: MessageEmbed[]

export const followUp = async (
    interaction: CommandInteraction,
    content: string,
    time?: number,
    color?: ColorResolvable
) => {
    if (!color) color = defaultColor
    embeds = [new MessageEmbed().setDescription(content).setColor(color)]
    const message = (await interaction.followUp({ embeds }).catch(error)) as Message

    const deleteMessage = () => message.delete().catch(error)
    if (time) setTimeout(deleteMessage, time * 1000)
    return message
}

export const interactionReply = async (
    interaction:
        | ModalSubmitInteraction
        | CommandInteraction
        | SelectMenuInteraction
        | ButtonInteraction
        | MessageComponentInteraction,
    content: string,
    ephemeral?: boolean,
    time?: number,
    color?: ColorResolvable
) => {
    if (!color) color = defaultColor
    if (!ephemeral) ephemeral = false
    embeds = [new MessageEmbed().setDescription(content).setColor(color)]
    const message = (await interaction.reply({ embeds, ephemeral }).catch(error)) as unknown as Message

    const deleteMessage = () => message.delete().catch(error)
    if (time) setTimeout(deleteMessage, time * 1000)
    return message
}

export const messageReply = async (
    message: Message,
    content: string,
    allowedMentions?: boolean,
    time?: number,
    color?: ColorResolvable
) => {
    if (!color) color = defaultColor
    if (!allowedMentions) allowedMentions = false
    embeds = [new MessageEmbed().setDescription(content).setColor(color)]
    const newMessage = (await message
        .reply({ embeds, allowedMentions: { repliedUser: allowedMentions } })
        .catch(error)) as unknown as Message

    const deleteMessage = () => newMessage.delete().catch(error)
    if (time) setTimeout(deleteMessage, time * 1000)
    return newMessage
}

export const send = async (
    channel: User | TextBasedChannel,
    content: string,
    time?: number,
    color?: ColorResolvable
) => {
    if (!color) color = defaultColor
    embeds = [new MessageEmbed().setDescription(content).setColor(color)]
    const message = (await channel.send({ embeds, allowedMentions: { repliedUser: false } }).catch(error)) as Message

    const deleteMessage = () => message.delete().catch(error)
    if (time) setTimeout(deleteMessage, time * 1000)
    return message
}
