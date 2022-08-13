import { Command } from "../../structures/Command"
import { GuildMember } from "discord.js"

export default new Command({
    name: "avatar",
    description: "commands related to member",
    options: [
        {
            type: "USER",
            name: "member",
            description: "The target member.",
            required: true,
        },
    ],
    ephemeral: true,
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
    async execute(command) {
        let member = (command.options.getMember("member") as GuildMember) ?? command.member

        command.followUp(member.displayAvatarURL({ size: 4096 }))
    },
})
