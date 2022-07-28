import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "kill",
    description: "Kill anyone with this command. [There are not going to die anyway.]",
    options: [
        {
            type: 6,
            name: "target",
            description: "The target member. [Rest In Peace]",
            required: true,
        },
    ],
    async execute(command) {
        const victim = command.options.getUser("target")

        const replies = [
            `${victim} has been shot`,
            `${victim} has been stabbed`,
            `${victim} has been drowned`,
            `${victim} has been electrified`,
            `A goose honked at ${victim} to death`,
            `Some psychopath zapped ${victim} with his laser eyes`,
            `${victim} ate a poisonous potato`,
            `${victim} died from slow mode being to long`,
            `${victim} was run over by car`,
            `${victim} was pushed in lava`,
            `${victim} was banned by the server owner`,
            `${victim} was found dead in a dumpster`,
            `${victim} got drunk and fell in the water`,
            `${victim} made a deal with the devil`,
            `An alien named MEE6 abducted ${victim} in their sleep`,
        ]

        followUp(command, replies[Math.floor(Math.random() * replies.length)])
    },
})
