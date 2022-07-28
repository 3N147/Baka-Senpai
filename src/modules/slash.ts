import { ApplicationCommandDataResolvable } from "discord.js"
import { readdirSync } from "fs"
import { guildId } from "../config"
import { ExtendedClient } from "../structures/Client"
import { CommandType } from "../typings/Command"

export default async (client: ExtendedClient) => {
    const path = `${__dirname}/../commands/`
    readdirSync(path).forEach(async (dir: string) => {
        const commandFiles = readdirSync(`${path}/${dir}`).filter(
            (file) => file.endsWith(".ts") || file.endsWith(".js"),
        )

        for (const file of commandFiles) {
            const command: CommandType = await client.importFile(`${path}/${dir}/${file}`)

            command.category = dir

            client.commands.set(command.name, command)

            if (command.aliases?.length) {
                command.aliases.forEach((alias) => {
                    const aliasCommand = Object.assign({}, command)
                    aliasCommand.name = alias
                    client.commands.set(alias, aliasCommand)
                })
            }
        }
    })
}
