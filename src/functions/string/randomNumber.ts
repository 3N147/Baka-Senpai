import md5 from "md5"
export const randomNumber = (input: string | object, seed: string, minimum?: number, maximum?: number) => {
    if (minimum > maximum) throw "Value of minimum must be smaller than maximum"
    const str = md5(JSON.stringify(input)) + seed

    let rating = parseInt(str.replace(/[^0-9]/g, ""))

    let i = 0

    while (rating > 100 && rating !== Infinity && i < 500) {
        rating *= parseFloat("0." + str + 465464) * 0.8
        i++
    }
    if (i === 500) rating = Math.round(Math.random() * 100)
    if (rating == Infinity) rating = 100

    if (!minimum && !maximum) return Math.round(rating)
    if (!maximum) return Math.round(minimum + rating)
    if (!minimum) return Math.round(maximum + rating / 100)
    return Math.round((maximum - minimum) * (rating / 100) + minimum)
}
