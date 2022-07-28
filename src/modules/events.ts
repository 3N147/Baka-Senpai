import { ClientEvents } from "discord.js"
import { readdirSync } from "fs"
import { ExtendedClient } from "../structures/Client"
import { Event } from "../structures/Event"

export default async (client: ExtendedClient) => {
    const path = `${__dirname}/../events/`
    readdirSync(path)
        .filter((file) => file.endsWith(".ts") || file.endsWith(".js"))
        .forEach(async (file: string) => {
            const event: Event<keyof ClientEvents> = await client.importFile(`${path}/${file}`)
            client.on(event.event, event.execute)
        })
}
