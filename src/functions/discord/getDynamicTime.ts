export const getDynamicTime = (date: string | number | Date, style: "SHORT" | "RELATIVE") => {
    const getSeconds = (date: string | number | Date) => Math.round(new Date(date).valueOf() / 1000)

    let type: string

    switch (style) {
        case "SHORT":
            type = "D"
            break
        case "RELATIVE":
            type = "R"
            break
    }

    return `<t:${getSeconds(date)}:${type}>`
}
