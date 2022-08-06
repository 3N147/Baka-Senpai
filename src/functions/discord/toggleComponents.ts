import { MessageActionRow, MessageButton } from "discord.js"

export const toggleComponents = (
    components: MessageActionRow[],
    disabled: boolean,
    ...customId: ["EVERY"] | string[]
) => {
    // to disable all components

    customId[0] === "EVERY"
        ? components.forEach((row) => row.components.forEach((x) => (x.disabled = disabled)))
        : components.forEach((row) =>
              row.components.forEach((x) => (customId.some((y) => x.customId === y) ? (x.disabled = disabled) : null)),
          )

    return components
}

export const toggleAnswerComponents = (components: MessageActionRow[], userAnswer: string, correctAnswer: string) =>
    components.map((row) => {
        row.components.map((component: MessageButton) => {
            component.setStyle("SECONDARY")
            component.disabled = true
            if (component.customId === userAnswer) component.setStyle("DANGER")
            if (component.customId === correctAnswer) component.setStyle("SUCCESS")
            return component
        })
        return row
    })
