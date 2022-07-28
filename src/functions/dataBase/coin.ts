import { getUserData } from "./getData"

export const addCoin = async (userId: string, amount: number) => {
    const userData = await getUserData(userId)
    userData.coin += amount
    userData.save()
    return { userData, amount }
}

export const setCoin = async (userId: string, amount: number) => {
    const userData = await getUserData(userId)
    userData.coin = amount
    userData.save()
    return { userData, amount }
}
