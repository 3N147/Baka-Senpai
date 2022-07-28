import { Command } from "../../structures/Command"
import axios from "axios"
import { followUp } from "../../functions/discord/message"

export default new Command({
    name: "joke",
    description: "Hack someone to get nothing.",
    options: [],
    async execute(command) {
        const data = await axios(
            "https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky,Christmas?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single"
        )
            .then((x) => x.data)
            .catch(console.error)
        if (!data) return
        followUp(command, data.joke)
    },
})
