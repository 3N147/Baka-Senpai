import axios from "axios"
import { MessageEmbed } from "discord.js"
import { color } from "../../config"
import { followUp } from "../../functions/discord/message"
import { titleCase } from "../../functions/string/normalize"

module.exports = {
    name: "meme",
    description: "Get a funny meme.",
    options: [],

    async execute(command) {
        const subRedditList = ["Animemes", "GoodAnimemes", "animememes", "AnimeMeme"]

        let i = 0
        let data: any = {}
        data.nsfw = true
        data.spoiler = true
        let embeds: MessageEmbed[]
        while ((data.nsfw || data.spoiler) && i < 10) {
            let subreddit = subRedditList[Math.floor(Math.random() * subRedditList.length)]
            let link = `https://meme-api.herokuapp.com/gimme/${subreddit}`

            data = await axios(link)
                .then((x) => x.data)
                .catch(console.error)

            let title = titleCase(data.title)
            embeds = [
                new MessageEmbed()
                    .setAuthor({ name: `r/${data.subreddit} : ${data.author}` })
                    .setTitle(title)
                    .setURL(data.postLink)
                    .setColor(color)
                    .setImage(data.url)
                    .setFooter({ text: `👍 : ${data.ups}` }),
            ]
            i++
        }
        if (data.nsfw || data.spoiler) return followUp(command, "Failed to get the meme.")

        command.followUp({ embeds }).catch(console.error)
    },
}
