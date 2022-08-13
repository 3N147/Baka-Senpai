import { economy } from "../../config"
import { UserDataType } from "../../schema/user"
import { ExtendedClient } from "../../structures/Client"
import { getUserData } from "./getData"
type UserDataResolvable = UserDataType | string

export const deposit = async (user: UserDataResolvable, amount: number) => {
    const userData = typeof user === "string" ? await getUserData(user) : user

    const free = userData.bankSize - userData.bank

    amount = Math.min(userData.coin, free, amount ?? Infinity)

    userData.coin -= amount
    userData.bank += amount
    userData.quickSave()

    return { userData, amount }
}

export const withdraw = async (user: UserDataResolvable, amount: number) => {
    const userData = typeof user === "string" ? await getUserData(user) : user

    if (!amount) amount = userData.bank

    userData.coin += amount
    userData.bank -= amount
    userData.quickSave()

    return { userData, amount }
}

export const addBankSize = async (user: UserDataResolvable, amount: number = economy.bankSize) => {
    const userData = typeof user === "string" ? await getUserData(user) : user

    userData.bankSize += amount
    userData.quickSave()
    return { userData, amount }
}
