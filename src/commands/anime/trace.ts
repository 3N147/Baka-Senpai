import axios from "axios"
import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "trace-anime",
    description: "Image being able to correctly trace anime from a single image.",
    options: [
        {
            type: "STRING",
            name: "url",
            description: "Link of your image.",
            required: true,
        },
    ],
    aliases: ["find-anime"],
    async execute(cmd) {
        const url = cmd.options.getString("url")
        const axiosData = await axios(`https://api.trace.moe/search?anilistInfo&url=${encodeURIComponent(url)}`)
            .then((x) => (x = x.data))
            .catch(console.error)
        if (!axiosData) return followUp(cmd, `OOPS! There is an API error. Please try again later.`)
        let result = []
        await axiosData.result.forEach((x) => {
            result.push(x.anilist.title.english || x.anilist.title.romaji || x.anilist.title.native)
        })
        return followUp(cmd, `Possible results: \n${result.join("\n")}`)
    },
})
