import { ChatInputApplicationCommandData, CommandInteraction, GuildMember, PermissionResolvable } from "discord.js"
import { ExtendedClient } from "../structures/Client"

export interface ExtendedCommand extends CommandInteraction {
    member: GuildMember
    client: ExtendedClient
}

export type CommandFunction = (interaction: ExtendedCommand) => any

export type CommandType = {
    permissions?: PermissionResolvable[]
    aliases?: string[]
    coolDown?: number
    devOnly?: boolean
    ephemeral?: boolean
    category?: string
    execute: CommandFunction
} & ChatInputApplicationCommandData
