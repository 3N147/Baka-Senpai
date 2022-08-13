require("dotenv").config()
import { registerFont } from "canvas"
import { getAnimeNews } from "./functions/anime/getAnimeNews"
import { startServer } from "./server"
import { ExtendedClient } from "./structures/Client"

export const client = new ExtendedClient()

client.start()

startServer()

registerFont("assets/fonts/Rubik.ttf", { family: "Rubik" })
