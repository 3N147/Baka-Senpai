import md5 from "md5"
export const randomNumber = (input: string | any, seed: string, minimum: number = 0, maximum: number = 100) => {
    if (minimum > maximum) throw "Value of minimum must be smaller than maximum"
    const str = md5(JSON.stringify(input) + seed)

    let rating = parseInt(str.replace(/[^0-9]/g, ""))

    let i = 0

    while (rating > 100 && rating !== Infinity && i < 500) {
        rating *= parseFloat("0." + str + 465464) * 0.8
        i++
    }

    rating /= 100

    if (rating == Infinity) rating = 1

    return Math.round((maximum - minimum) * rating + minimum)
}

export const randomString = (length: number, number: boolean = false) => {
    let chars = "abcdefghijklmnopqrstuvwxyz"

    if (number) chars += "0123456789"

    let array = []

    for (let i = 0; i < length; i++) {
        array.push(chars.charAt(Math.floor(Math.random() * chars.length)))
    }

    return array.join("")
}

export const randomizeIndex = (array: any[]) => {
    if (array.length === 0) return array
    for (let index = 0; index < array.length; index++) {
        let i = Math.floor(Math.random() * array.length)
        let randomItem = array[i]
        array[i] = array[index]
        array[index] = randomItem
    }
    return array
}

export const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]
