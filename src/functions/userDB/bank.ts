import { economy } from "../../config"
import { UserDataType } from "../../schema/user"
import { ExtendedClient } from "../../structures/Client"
import { getUserData } from "./getData"

export const deposit = async (userId: string, amount: number, client: ExtendedClient, userData?: UserDataType) => {
    if (!userData) userData = await getUserData(userId)

    const free = userData.bankSize - userData.bank

    amount = Math.min(userData.coin, free, amount ?? Infinity)

    userData.coin -= amount
    userData.bank += amount
    userData.quickSave(client)

    return { userData, amount }
}

export const withdraw = async (userId: string, amount: number, client: ExtendedClient, userData?: UserDataType) => {
    if (!userData) userData = await getUserData(userId)

    if (!amount) amount = userData.bank

    userData.coin += amount
    userData.bank -= amount
    userData.quickSave(client)

    return { userData, amount }
}

export const addBankSize = async (
    userId: string,
    amount: number = economy.bankSize,
    client: ExtendedClient,
    userData?: UserDataType,
) => {
    if (!userData) userData = await getUserData(userId)
    userData.bankSize += amount
    userData.quickSave(client)
    return { userData, amount }
}
