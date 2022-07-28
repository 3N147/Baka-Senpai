import { Collection } from "discord.js"
import { readdirSync } from "fs"
import { ExtendedClient } from "../structures/Client"
import { CommandFunction } from "../typings/Command"

export default async (client: ExtendedClient) => {
    const path = `${__dirname}/../subCommands/`
    readdirSync(path).forEach(async (dir) => {
        const subCommands = readdirSync(`${path}/${dir}`)

        const subCommandList: Collection<string, CommandFunction> = new Collection()

        subCommands.forEach(async (file) => {
            const subcommand = await client.importFile(`${path}/${dir}/${file}`)
            subCommandList.set(subcommand.name, subcommand.execute)
        })

        client.subCommands.set(dir, subCommandList)
    })
}
