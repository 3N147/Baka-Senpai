import { GuildMember, MessageEmbed, PermissionResolvable, Permissions, PermissionString } from "discord.js"
import { color } from "../../config"
import { titleCase } from "../../functions/string/normalize"
import { Command } from "../../structures/Command"
import { ExtendedCommand } from "../../typings/Command"

export default new Command({
    name: "user-info",
    description: "Get information of a user.",
    options: [
        {
            type: "USER",
            name: "user",
            description: "The target user.",
            required: false,
        },
    ],

    ephemeral: true,
    async execute(command: ExtendedCommand) {
        const member = (command.options.getMember("user") as GuildMember) || command.member
        const { user } = member

        const cross = "❌"

        const moderationPermissions: PermissionString[] = [
            "KICK_MEMBERS",
            "BAN_MEMBERS",
            "MANAGE_CHANNELS",
            "MANAGE_GUILD",
            "MANAGE_MESSAGES",
            "MENTION_EVERYONE",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MOVE_MEMBERS",
            "MANAGE_NICKNAMES",
            "MANAGE_ROLES",
            "MANAGE_WEBHOOKS",
            "MANAGE_EMOJIS_AND_STICKERS",
            "MANAGE_EVENTS",
            "MANAGE_THREADS",
            "MODERATE_MEMBERS",
            "ADMINISTRATOR",
        ]

        let isMod: boolean
        moderationPermissions.forEach((x: PermissionString) => {
            if (member.permissions.has(x)) isMod = true
        })

        let Acknowledgment: string
        if (member.guild.ownerId === user.id) {
            Acknowledgment = "Server Owner"
        } else if (member.permissions.has("ADMINISTRATOR")) {
            Acknowledgment = "Server Administrator"
        } else if (isMod) {
            Acknowledgment = "Server Moderator"
        } else {
            Acknowledgment = "Member"
        }

        let fields = [
            {
                name: "Nickname:",
                value: member.nickname || cross,
                inline: true,
            },
            {
                name: "Username:",
                value: user.username,
                inline: true,
            },
            {
                name: "Tag:",
                value: `${user.tag}${user.bot ? " : Bot" : ""}`,
                inline: true,
            },
            {
                name: "Created:",
                value: `<t:${Math.floor(new Date(parseInt(user.id) / 4194304 + 1420070400000).getTime() / 1000)}:D>`,
                inline: true,
            },
            {
                name: "Joined:",
                value: `<t:${Math.floor(member.joinedTimestamp / 1000)}>`,
                inline: true,
            },

            {
                name: "Roles:",
                value:
                    member.roles.cache
                        .filter((role) => role.name !== "@everyone" && !role.managed)
                        .map((role) => `<@&${role.id}>`)
                        .join(", ") || cross,
            },
            {
                name: "Permissions:",
                value: titleCase(
                    member.permissions
                        .toArray()
                        .filter((perm) => moderationPermissions.includes(perm))
                        .join(", ") || cross,
                ),
            },
            {
                name: "Badges:",
                value: titleCase(user.flags.toArray().join(", ") || cross),
                inline: true,
            },
            {
                name: "Acknowledgment:",
                value: Acknowledgment || cross,
                inline: true,
            },
        ]

        const embeds = [
            new MessageEmbed()
                .setColor(color)
                .addFields(...fields)
                .setThumbnail(member.displayAvatarURL())
                .setTimestamp()
                .setTitle("User Info")
                .setAuthor({
                    iconURL: command.member.displayAvatarURL({ dynamic: false }),
                    name: command.user.tag,
                }),
        ]

        command.followUp({ embeds }).catch(console.error)
    },
})
