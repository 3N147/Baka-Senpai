import axios from "axios"
import { load } from "cheerio"
import { logError } from "../log/logger"
import { spacing, titleCase } from "../string/normalize"

type AnimeNewsType = {
    title: string
    description: string
    url: string
    image: string
    topic: string
    time: Date
}

export const getAnimeNews = async () => {
    const URL = "https://www.animenewsnetwork.com/news/"

    const data = await axios(URL)
        .then((res) => res.data)
        .catch(logError)

    if (!data) return []

    const $ = load(data)

    const newses: AnimeNewsType[] = []

    $("div.herald").each((i, el) => {
        const title = titleCase($(el).find("div.wrap > div > h3 > a").text())
        const url = "https://www.animenewsnetwork.com" + $(el).find("div.wrap > div > h3 > a").attr("href")
        const description = spacing($(el).find("div.preview").text())
        const time = new Date($(el).find("time").attr("datetime"))
        const image =
            "https://cdn.animenewsnetwork.com" +
            $(el)
                .find("div.thumbnail")
                .attr("data-src")
                .replace(/\/cover/, "/crop")
        const topic = $(el).find(".topics > a").attr("topic")
        newses.push({ title, url, description, time, image, topic })
    })

    return newses.sort((a, b) => b.time.valueOf() - a.time.valueOf())
}
