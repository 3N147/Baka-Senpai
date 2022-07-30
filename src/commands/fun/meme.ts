import axios from "axios"
import { MessageEmbed } from "discord.js"
import { color } from "../../config"
import { getEmbed } from "../../functions/discord/getEmbed"
import { followUp } from "../../functions/discord/message"
import { titleCase } from "../../functions/string/normalize"
import { Command } from "../../structures/Command"

export default new Command({
    name: "meme",
    description: "Get a funny meme.",
    options: [],
    async execute(command) {
        const subRedditList = ["Animemes", "GoodAnimemes", "animememes", "AnimeMeme"]

        let data: any
        let embeds: MessageEmbed[]

        for (let i = 0; i < 5; i++) {
            let subreddit = subRedditList[Math.floor(Math.random() * subRedditList.length)]
            let link = `https://meme-api.herokuapp.com/gimme/${subreddit}`

            data = await axios(link).catch(console.error)
            data = data.data

            if (!data.nsfw && !data.spoiler) break
        }

        if (data.nsfw || data.spoiler) return followUp(command, "Failed to get the meme.")

        let title = titleCase(data.title)

        embeds = [
            getEmbed(command)
                .setAuthor({
                    name: `u/${data.author}`,
                    url: `https://www.reddit.com/user/${data.author}`,
                    iconURL: `https://cdn.discordapp.com/emojis/1002617575076810914.webp`,
                })
                .setTitle(title)
                .setURL(data.postLink)
                .setColor(color)
                .setImage(data.url)
                .setFooter({ text: `👍 : ${data.ups} | r/${data.subreddit}` }),
        ]

        command.followUp({ embeds }).catch(console.error)
    },
})
