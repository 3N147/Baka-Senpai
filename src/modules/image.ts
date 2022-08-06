import { loadImage } from "canvas"
import { readdirSync } from "fs"
import { ExtendedClient } from "../structures/Client"

export default async (client: ExtendedClient) => {
    const path = `./assets/images`
    readdirSync(path).forEach(async (file: string) => {
        const image = await loadImage(`${path}/${file}`)
        client.images.set(file, image)
    })
}
