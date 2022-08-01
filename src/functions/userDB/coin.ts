import { ExtendedClient } from "../../structures/Client"
import { getUserData } from "./getData"

export const addCoin = async (userId: string, amount: number, client: ExtendedClient) => {
    const userData = await getUserData(userId)
    userData.coin += amount
    userData.quickSave(client)
    return { userData, amount }
}

export const setCoin = async (userId: string, amount: number, client: ExtendedClient) => {
    const userData = await getUserData(userId)
    userData.coin = amount
    userData.quickSave(client)
    return { userData, amount }
}
