export const getLines = async (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    const words = text.split(/ +/g)
    const lines = []
    let currentLine = words[0]

    for (let i = 1; i < words.length; i++) {
        let word = words[i]
        const width = ctx.measureText(currentLine + " " + word).width
        if (width < maxWidth) {
            currentLine += " " + word
        } else {
            lines.push(currentLine)
            currentLine = word
        }
    }

    lines.push(currentLine)
    return lines.join("\n")
}
