export const titleCase = (title: String) =>
    title
        .toLowerCase()
        .replace(/_/g, " ")
        .split(/ +/g)
        .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
        .join(" ")

export const spacing = (string: string) => string.replace(/( |\n)/g, " ").trim()
