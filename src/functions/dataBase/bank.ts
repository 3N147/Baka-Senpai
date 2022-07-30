import { economy } from "../../config"
import { getUserData } from "./getData"

//  Deposit
export const depositAmount = async (userId: string, amount: number) => {
    const userData = await getUserData(userId)

    if (amount > userData.coin) throw `Invalid amount. Amount must be lower than coin amount.`

    userData.coin -= amount
    userData.bank += amount
    userData.save()

    return { userData, amount }
}

export const depositAll = async (userId: string) => {
    const userData = await getUserData(userId)

    let amount = userData.bankSize - userData.bankSize
    if (amount > userData.coin) amount = userData.coin

    userData.coin -= amount
    userData.bank += amount
    userData.save()

    return { userData, amount }
}

//  Withdraw
export const withdrawAmount = async (userId: string, amount: number) => {
    const userData = await getUserData(userId)

    if (amount > userData.bank) throw `Invalid amount. Amount must be lower than bank amount.`

    userData.coin += amount
    userData.bank -= amount
    userData.save()

    return { userData, amount }
}

export const withdrawAll = async (userId: string) => {
    const userData = await getUserData(userId)

    const amount = userData.bank

    userData.coin += amount
    userData.bank += 0
    userData.save()

    return { userData, amount }
}

export const addBankSize = async (userId: string, amount?: number) => {
    const userData = await getUserData(userId)
    amount = amount || economy.bankSize
    userData.bankSize += amount
    return { userData, amount }
}
