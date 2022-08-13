import {
    MessageActionRow,
    MessageActionRowComponent,
    MessageButton,
    MessageButtonStyle,
    TextInputComponent,
    TextInputStyle,
} from "discord.js"

export const createRow = (...components: MessageActionRowComponent[]) =>
    new MessageActionRow().setComponents(components)

export const createButton = (
    label: string,
    customId: string,
    style: MessageButtonStyle = "SECONDARY",
    disabled?: boolean,
    emoji?: string,
) => {
    const button = new MessageButton().setStyle(style)
    if (label) button.setLabel(label)
    style === "LINK" ? button.setURL(customId) : button.setCustomId(customId)
    if (emoji) button.setEmoji(emoji)
    if (disabled) button.setDisabled(disabled)
    return button
}

export const createModalComponents = (
    label: string,
    customId: string,
    placeholder: string,
    style: TextInputStyle,
    required: boolean = true,
    min?: number,
    max?: number,
) => {
    const textInput = new TextInputComponent()
        .setLabel(label)
        .setCustomId(customId)
        .setPlaceholder(placeholder)
        .setStyle(style)
        .setRequired(required)

    if (min) textInput.setMinLength(min)
    if (max) textInput.setMaxLength(max)

    return new MessageActionRow({ components: [textInput] })
}
