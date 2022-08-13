import { UserDataType } from "../../schema/user"
import { getUserData } from "./getData"

type UserDataResolvable = UserDataType | string

export const addCoin = async (user: UserDataResolvable, amount: number) => {
    const userData = typeof user === "string" ? await getUserData(user) : user
    userData.coin += amount
    userData.quickSave()
    return { userData, amount }
}

export const setCoin = async (user: UserDataResolvable, amount: number) => {
    const userData = typeof user === "string" ? await getUserData(user) : user
    userData.coin = amount
    userData.quickSave()
    return { userData, amount }
}
