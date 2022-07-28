import { Client, Collection } from "discord.js"
import { CommandFunction, CommandType } from "../typings/Command"
import { RegisterCommandsOptions } from "../typings/client"
import { SelectType } from "../typings/Components"
import { readdirSync } from "fs"
import { error, log } from "console"
import deepai from "deepai"

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection()
    selectMenus: Collection<string, SelectType> = new Collection()
    coolDown: Collection<string, Collection<string, number>> = new Collection()
    subCommands: Collection<string, Collection<string, CommandFunction>> = new Collection()

    constructor() {
        super({ intents: 32767 })
    }

    async start() {
        await this.registerModules()
        this.login(process.env.TOKEN).then(() => log(`${this.user.tag} is ready`))
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
        const modules = readdirSync(`${__dirname}/../modules/`).filter(
            (file) => file.endsWith(".ts") || file.endsWith(".js"),
        )
        modules.forEach(async (file) => (await this.importFile(`${__dirname}/../modules/${file}`))(this))
    }
}
