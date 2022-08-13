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
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
    async execute(command) {
        const victim = command.options.getUser("target")
        const user = command.user

        const replies = [
            `${victim} has been shot by ${user}.`,
            `${victim} has been stabbed by ${user}.`,
            `${victim} has been drowned by ${user}.`,
            `${victim} has been electrified by ${user}.`,
            `A goose named ${user}, honked at ${victim} to death.`,
            `Some psychopath named ${user}. zapped ${victim} with his laser eyes.`,
            `${victim} ate a poisonous potato.`,
            `${victim} died from slow mode being to long.`,
            `${victim} was run over by car.`,
            `${victim} was pushed by ${user} in lava.`,
            `${victim} was banned by the server owner.`,
            `${victim} was found dead in a dumpster.`,
            `${victim} got drunk and fell in the water.`,
            `${victim} made a deal with the devil.`,
            `An alien named ${user} abducted ${victim} in their sleep.`,
        ]

        followUp(command, replies[Math.floor(Math.random() * replies.length)])
    },
})
