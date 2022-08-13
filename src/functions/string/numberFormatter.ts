export const numberWithSiSuffix = (num: number) => {
    if (num < 1) return num
    const SI = [
        { value: 1e18, symbol: "E" },
        { value: 1e15, symbol: "P" },
        { value: 1e12, symbol: "T" },
        { value: 1e9, symbol: "G" },
        { value: 1e6, symbol: "M" },
        { value: 1e3, symbol: "k" },
        { value: 1, symbol: "" },
    ]

    const regex = /\.0+$|(\.[0-9]*[1-9])0+$/ // find (5454.0 = .0)

    let i: number
    for (i = 0; i < SI.length; i++) {
        if (num >= SI[i].value) break
    }

    return (num / SI[i].value).toFixed(2).replace(regex, "$1") + SI[i].symbol
}

export const numberWithComma = (number: number) => {
    number -= number % 1
    let i = 0

    return number
        .toString()
        .split("")
        .reduceRight((a, c) => {
            i++
            return i % 3 === 0 ? `${c},${a}` : c + a
        })
}
