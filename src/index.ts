import { registerFont } from "canvas"
import { startServer } from "./server"
import { ExtendedClient } from "./structures/Client"
import dotenv from "dotenv"

dotenv.config()

export const client = new ExtendedClient()

client.start()

startServer()

registerFont("assets/fonts/Rubik.ttf", { family: "Rubik" })
