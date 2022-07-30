import { EmbedFieldData } from "discord.js"
import { getDynamicTime } from "../../functions/discord/getDynamicTime"
import { getEmbed } from "../../functions/discord/getEmbed"
import { Command } from "../../structures/Command"

export default new Command({
    name: "server-list",
    description: "Reload all slash command",
    ephemeral: true,
    devOnly: true,
    async execute(command) {
        const guilds = command.client.guilds.cache

        const fields: EmbedFieldData[] = guilds
            .map(({ name, id, ownerId, memberCount, me }) => ({
                name: `${name}:${memberCount}`,
                value: `ID: ${id}\nOwner: ${ownerId}\n Me:${getDynamicTime(me.joinedAt, "SHORT")}`,
            }))
            .slice(0, 20)

        const embeds = [getEmbed(command).setFields(fields).setDescription(`Total ${guilds.size} server.`)]

        command.followUp({ embeds }).catch(console.error)
    },
})
