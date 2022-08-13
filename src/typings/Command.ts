import {
    ApplicationCommandOptionChoiceData,
    AutocompleteInteraction,
    ChatInputApplicationCommandData,
    CommandInteraction,
    GuildMember,
    InteractionReplyOptions,
    Message,
    MessagePayload,
    PermissionString,
} from "discord.js"
import { ExtendedClient } from "../structures/Client"

export interface ExtendedCommand extends CommandInteraction {
    member: GuildMember
    client: ExtendedClient
    smartFollowUp: (content: string, seconds?: number) => Promise<Message>
    smartReply: (content: string, ephemeral?: boolean, seconds?: number) => Promise<Message>
}
export interface ExtendedAutoComplete extends AutocompleteInteraction {
    member: GuildMember
    client: ExtendedClient
}

export type CommandFunction = (interaction: ExtendedCommand) => any
export type AutoCompleteFunction = (interaction: ExtendedAutoComplete) => Promise<ApplicationCommandOptionChoiceData[]>

export type CommandType = {
    autocomplete?: AutoCompleteFunction
    permissions?: PermissionString[]
    botPermissions?: PermissionString[]
    aliases?: string[]
    coolDown?: number
    devOnly?: boolean
    ephemeral?: boolean
    category?: string
    disableReply?: boolean
    execute: CommandFunction
} & ChatInputApplicationCommandData
