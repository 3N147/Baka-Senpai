import { GuildMember, MessageEmbed, PermissionResolvable, Permissions, PermissionString, Role } from "discord.js"
import { color } from "../../config"
import { getDynamicTime } from "../../functions/discord/getDynamicTime"
import { getEmbed } from "../../functions/discord/getEmbed"
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
        const { user, roles, permissions } = member

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

        let isMod = moderationPermissions.some((x) => member.permissions.has(x))

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

        const roleFilter = (role: Role) => role.name !== "@everyone"
        const mapToString = (x) => `${x}`

        const rolesString = roles.cache.filter(roleFilter).map(mapToString).join(", ") || cross
        const memberPermissions = titleCase(moderationPermissions.filter((x) => permissions.has(x)).join(", ")) || cross

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
                value: getDynamicTime(user.createdAt, "SHORT"),
                inline: true,
            },
            {
                name: "Joined:",
                value: getDynamicTime(member.joinedAt, "SHORT"),
                inline: true,
            },

            {
                name: "Roles:",
                value: rolesString,
            },
            {
                name: "Permissions:",
                value: memberPermissions,
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
            getEmbed(command)
                .setTitle("User Info")
                .addFields(...fields)
                .setThumbnail(member.displayAvatarURL({ size: 4096 })),
        ]

        command.followUp({ embeds }).catch(console.error)
    },
})
