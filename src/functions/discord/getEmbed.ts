import { Client, EmbedAuthorData, EmbedFooterData, MessageEmbed, User } from "discord.js"
import { color } from "../../config"

export const getFooter = (user: User): EmbedFooterData => ({
    text: user.tag,
    iconURL: user.displayAvatarURL({ dynamic: false }),
})

export const getAuthor = (user: User): EmbedAuthorData => ({
    name: user.tag,
    iconURL: user.displayAvatarURL({ dynamic: false }),
})

export const getEmbed = (client: Client, user: User) =>
    new MessageEmbed().setColor(color).setAuthor(getAuthor(client.user)).setFooter(getFooter(user))
