import dotenv from "dotenv"
dotenv.config()

import { startServer } from "./server"
import { ExtendedClient } from "./structures/Client"

export const client = new ExtendedClient()

client.start()

startServer()
