export const titleCase = (title: String) =>
    title
        .toLowerCase()
        .replace(/( |_)+/g, " ")
        .replace(/([a-z]|')+/gi, (str) => str.charAt(0).toUpperCase() + str.slice(1))
        .trim()

export const spacing = (string: string) => string.replace(/( |\n)/g, " ").trim()
