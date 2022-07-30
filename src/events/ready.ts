import mongoose from "mongoose"
import { guildId } from "../config"
import { ExtendedClient } from "../structures/Client"
import { Event } from "../structures/Event"

export default new Event("ready", async (client: ExtendedClient) => {
    await mongoose.connect(process.env.MONGODB).then(() => console.log("Connected to MongoDB"))

    const commands = Array.from(client.commands.values())

    await client.registerCommands({ commands, guildId })
})
