import { GuildMember, PermissionResolvable, SelectMenuInteraction } from "discord.js"

export interface ExtendedSelect extends SelectMenuInteraction {
    member: GuildMember
}

export interface ExtendedButton extends SelectMenuInteraction {
    member: GuildMember
}

export type SelectType = {
    name: string
    permissions?: PermissionResolvable[]
    execute: (interaction: ExtendedSelect) => any
}
