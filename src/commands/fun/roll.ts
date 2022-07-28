import { Command } from "../../structures/Command"
export default new Command({
    name: "roll",
    description: "Roll a dice",
    options: [],
    async execute(command) {
        command
            .followUp(`https://www.calculator.net/img/dice${Math.floor(Math.random() * 6) + 1}.png`)
            .catch(console.error)
    },
})
