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

interface EmbedGeneratorOptions {
    user?: User
    author?: User
    client: Client
}

export const getEmbed = ({ user, author, client }: EmbedGeneratorOptions) =>
    new MessageEmbed()
        .setColor(color)
        .setAuthor(getAuthor(client.user))
        .setFooter(getFooter(user ?? author))
        .setTimestamp()
