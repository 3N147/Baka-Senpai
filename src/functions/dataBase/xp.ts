import { getUserData } from "./getData"

// Some of the code from Discord-xp: https://github.com/MrAugu/discord-xp

export const addXp = async (userId: string, amount: number) => {
    const userData = await getUserData(userId)

    const currentLevel = userData.level

    userData.xp += amount
    userData.level = Math.floor(0.1 * Math.sqrt(userData.xp))
    userData.save()

    let levelUp = false
    if (userData.level > currentLevel) levelUp = true
    return { userData, levelUp }
}

export const setXp = async (userId: string, amount: number) => {
    const userData = await getUserData(userId)

    const currentLevel = userData.level

    userData.xp = amount
    userData.level = Math.floor(0.1 * Math.sqrt(userData.xp))
    userData.save()

    let levelUp = false
    if (userData.level > currentLevel) levelUp = true
    return { userData, levelUp }
}

export const getXp = (level: number) => level * level * 100
export const getLevel = (xp: number) => Math.floor(0.1 * Math.sqrt(xp))
