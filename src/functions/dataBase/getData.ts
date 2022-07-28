import { bankSize } from "../../config"
import { UserDataBase, UserDataType } from "../../schema/user"

export const getUserData = async (userId: string) => {
    let data: UserDataType = await UserDataBase.findOne({ _id: userId })
    if (!data)
        data = await UserDataBase.create({
            _id: userId,
            level: 1,
            xp: 0,
            coin: 0,
            bank: 0,
            bankSize
        })

    return data
}
