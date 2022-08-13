import { client } from "../.."
import { UserDataBase, UserDataType } from "../../schema/user"

export const getUserData = async (userId: string) => {
    const userData: UserDataType =
        client.userData.get(userId) ??
        (await UserDataBase.findOne({ userId })) ??
        (await UserDataBase.create({ userId }))

    userData.quickSave = async function () {
        await this.save()
        client.userData.set(this.userId, this)
    }

    client.userData.set(userData.userId, userData)

    return userData
}
