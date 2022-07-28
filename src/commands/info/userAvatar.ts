import { Command } from "../../structures/Command"

import { GuildMember, MessageEmbed } from "discord.js"
import { color } from "../../config"
export default new Command({
    name: "avatar",
    description: "commands related to member",
    options: [
        {
            type: 6,
            name: "member",
            description: "The target member.",
            required: true
        }
    ],
    ephemeral: true,
    async execute(command) {
        let member = (command.options.getMember("member") as GuildMember) || command.member

        const embeds = [new MessageEmbed().setColor(color).setImage(member.displayAvatarURL({ size: 1024 }))]

        command.followUp({ embeds }).catch(console.error)
    }
})
