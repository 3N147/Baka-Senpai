import { MessageActionRow } from "discord.js"

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
