import { Client, Collection, MessageEmbed, Webhook, WebhookClient } from "discord.js"
import { CommandFunction, CommandType } from "../typings/Command"
import { RegisterCommandsOptions } from "../typings/client"
import { ButtonType, SelectType } from "../typings/Components"
import { readdirSync } from "fs"
import { error, log } from "console"
import deepai from "deepai"
import { UserDataType } from "../schema/user"
import { Image } from "canvas"
import { logError } from "../functions/log/logger"
import { color, intents, partials } from "../config"
import mongoose from "mongoose"
import { AnimeNews, AnimeNewsDataType } from "../schema/animenews"
import { getAnimeNews } from "../functions/anime/getAnimeNews"
import { getAuthor } from "../functions/discord/getEmbed"

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection()
    userData: Collection<string, UserDataType> = new Collection()
    selectMenus: Collection<string, SelectType> = new Collection()
    buttons: Collection<string, ButtonType> = new Collection()
    coolDown: Collection<string, Collection<string, number>> = new Collection()
    images: Collection<string, Image> = new Collection()

    constructor() {
        super({ intents, partials })
    }

    async start() {
        await this.registerModules()

        setInterval(this.postAnimeNews, 1000 * 60 * 15) // every 20min

        this.login(process.env.TOKEN).catch(logError)

        await mongoose
            .connect(process.env.MONGODB)
            .then((m) => console.log(`Connected to MongoDB. Collections: ${m.modelNames().join(", ")}`))
            .catch(logError)

        deepai.setApiKey(process.env.deepai)
    }

    async importFile(filePath: string) {
        return (await import(filePath))?.default
    }

    async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
        if (guildId) return this.guilds.cache.get(guildId)?.commands.set(commands).catch(error)

        this.application?.commands.set(commands).catch(error)
    }

    async registerModules() {
        const filter = (file: string) => file.endsWith(".ts") || file.endsWith(".js")
        const modules = readdirSync(`${__dirname}/../modules/`).filter(filter)

        modules.forEach(async (file) => (await this.importFile(`${__dirname}/../modules/${file}`))(this))
    }

    async postAnimeNews() {
        const newsData = (await getAnimeNews()).filter((news) => ["anime", "manga"].includes(news.topic))
        const entries = (await AnimeNews.find()) as AnimeNewsDataType[]

        entries.forEach((data) => {
            const newses = newsData.filter((news) => news.time.valueOf() > data.lastPost.valueOf()).slice(0, 4)
            if (!newses.length) return

            const embeds: MessageEmbed[] = newses.map((news) => {
                const embed = new MessageEmbed()
                    .setColor(color)
                    .setTitle(news.title)
                    .setDescription(news.description)
                    .setImage(news.image)
                    .setURL(news.url)
                    .setTimestamp(news.time)
                    .setFooter({
                        text: "Anime News Network",
                        iconURL: "https://pbs.twimg.com/profile_images/199100222/ANN_Logo_dots_400x400.png",
                    })

                if (this.user?.avatar) embed.setAuthor(getAuthor(this.user))

                return embed
            })

            const webhook = new WebhookClient({ url: data.webhookURL })
            webhook.send({ embeds, content: data.content }).catch(logError)
        })
        await AnimeNews.updateMany({}, { lastPost: new Date() })
    }
}
