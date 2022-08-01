import { ButtonInteraction, GuildMember, PermissionResolvable, SelectMenuInteraction } from "discord.js"
import { ExtendedClient } from "../structures/Client"

export interface ExtendedSelect extends SelectMenuInteraction {
    member: GuildMember
    client: ExtendedClient
}

export interface ExtendedButton extends ButtonInteraction {
    member: GuildMember
    client: ExtendedClient
}

export type SelectType = {
    name: string
    permissions?: PermissionResolvable[]
    execute: (interaction: ExtendedSelect) => any
}

export type ButtonType = {
    name: string
    permissions?: PermissionResolvable[]
    execute: (interaction: ExtendedButton) => any
}
