import { MessageActionRow, MessageButton, MessageButtonStyle, MessageComponent } from "discord.js"

export const createRow = (...components: MessageComponent[]) => new MessageActionRow().setComponents(components)

export const createButton = (
    label: string,
    customId: string | null,
    style: MessageButtonStyle = "SECONDARY",
    disabled?: boolean,
    emoji?: string | null | false,
    url?: string,
) => {
    const button = new MessageButton().setLabel(label).setStyle(style)
    if (customId) button.setCustomId(customId)
    if (style === "LINK" && url) button.setURL(url)
    if (emoji) button.setEmoji(emoji)
    if (disabled) button.setDisabled(disabled)
    return button
}
