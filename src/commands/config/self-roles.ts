import {
    ButtonInteraction,
    Message,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
    MessageSelectOption,
    SelectMenuInteraction,
    TextChannel,
} from "discord.js"
import { color } from "../../config"
import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "self-role",
    description: "Create a new self role message.",
    options: [
        {
            type: "SUB_COMMAND",
            name: "quick-setup",
            description: "Quick setup a self-role message.",
            options: [
                {
                    type: "STRING",
                    name: "title",
                    description: "Title of the embed.",
                    required: true,
                },
                {
                    type: "CHANNEL",
                    name: "channel",
                    channelTypes: ["GUILD_TEXT", "GUILD_NEWS"],
                    description: "Target channel to send self-role message.",
                    required: true,
                },
                {
                    type: "INTEGER",
                    name: "limit",
                    description: "Maximum number of role member can take from this message.",
                },
            ],
        },
    ],
    permissions: ["MANAGE_ROLES"],
    botPermissions: ["MANAGE_ROLES", "EMBED_LINKS", "SEND_MESSAGES"],
    ephemeral: true,
    async execute(command) {
        //  Title of the embed that will contain roles list
        const title = command.options.getString("title")
        let limit = command.options.getInteger("limit") ?? 25
        const channel = command.options.getChannel("channel") as TextChannel

        //  Taking all roles from to make a list
        let roles = command.guild.roles.cache.filter(
            (x) => !x.managed && !x.permissions.has("ADMINISTRATOR") && x.name !== "@everyone" && x.editable,
        )

        if (command.user.id !== command.guild.ownerId)
            roles.filter((x) => x.comparePositionTo(command.member.roles.highest) < 0)

        if (!roles.size) return followUp(command, `Server don't have any roles that can be managed by you.`)

        //  Converting roles to select menu option to send in a message
        //  Member will select all roles from the server roles list
        const options = roles.map((role) => ({ label: role.name, value: role.id }))

        //  A select menu option can contain only 25 option
        //  We have to list them in multiple pages
        const pages = Math.floor((options.length - 1) / 25)

        //  To control pagination
        let page = 0
        let nextPage = pages > 0 ? true : false
        let previousPage = false
        /////------------------/////

        //  Embeds
        let embeds: MessageEmbed[] = [new MessageEmbed().setTitle("Select roles:").setColor(color)]

        //  Components
        let components = [
            new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId("self-roles-guild-roles")
                    .setPlaceholder("select roles that you want add.")
                    .setMaxValues(options.length > 25 ? 25 : options.length)
                    .setMinValues(1)
                    .setOptions(...options.slice(0, 25)),
            ),

            new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId("previous")
                    .setLabel("◀")
                    .setStyle("PRIMARY")
                    .setDisabled(!previousPage),

                new MessageButton().setCustomId("done").setLabel("Done").setStyle("SUCCESS").setDisabled(true),

                new MessageButton().setCustomId("next").setLabel("▶").setStyle("PRIMARY").setDisabled(!nextPage),
            ),
        ]

        const toggleButtons = (button: "previous" | "done" | "next", disabled: boolean) => {
            let index = 0
            switch (button) {
                case "previous":
                    index = 0
                    break
                case "done":
                    index = 1
                    break
                case "next":
                    index = 2
                    break
            }

            components[1].components[index].disabled = disabled
        }

        const setOptions = (range: number[]) => {
            let selectMenu = components[0].components[0] as MessageSelectMenu

            selectMenu.maxValues = options.slice(...range).length > 25 ? 25 : options.slice(...range).length

            selectMenu.options = options.slice(...range) as MessageSelectOption[]
            components[0].components[0] = selectMenu
        }

        const setDescription = (str: string) => embeds[0].setDescription(str)

        //  Message
        const message = (await command
            .followUp({ embeds, components, fetchReply: true })
            .catch(console.error)) as Message

        if (!message) return

        //  Message component collector for role selecting
        const collector = message.createMessageComponentCollector({ idle: 60 * 1000 })

        let roleList: string[] = []

        //  Select Menu interaction function
        async function selectMenuInteraction(interaction: SelectMenuInteraction) {
            interaction.deferUpdate() // Defer

            const { values } = interaction

            //  Taking roles filter new values with old values
            //  Thats way user can remove roles after selecting
            roleList = [...roleList.filter((x) => !values.includes(x)), ...values.filter((x) => !roleList.includes(x))]

            setDescription(roleList.map((x) => `<@&${x}>`).join("\n"))

            roleList.length ? toggleButtons("done", false) : toggleButtons("done", true)

            command.editReply({ embeds, components }).catch(console.error)
        }

        //  Button interaction function
        async function buttonInteraction(interaction: ButtonInteraction) {
            interaction.deferUpdate()
            if (interaction.customId === "done") {
                //  Done button

                let option = roles.filter((x) => roleList.includes(x.id)).map((x) => ({ label: x.name, value: x.id }))

                if (option.length > 25) option = option.slice(0, 25)

                setDescription(option.map((x) => `<@&${x.value}>`).join("\n"))

                embeds = [new MessageEmbed().setDescription(embeds[0].description).setColor(color).setTitle(title)]

                limit = limit > option.length ? option.length : limit

                components = [
                    new MessageActionRow().addComponents(
                        new MessageSelectMenu()
                            .setCustomId("Baka-select-role")
                            .setPlaceholder(title)
                            .setMaxValues(limit)
                            .setMinValues(0)
                            .setOptions(...option),
                    ),
                ]

                await channel.send({ embeds, components }).catch(console.error)

                embeds = [new MessageEmbed().setColor("GREEN").setDescription("Self-role created.")]

                command.editReply({ embeds, components: [] })
            }

            if (interaction.customId === "next") {
                //  Next page button
                page++

                setOptions([page * 25, (page + 1) * 25])

                if (page === pages) toggleButtons("next", true)
                toggleButtons("previous", false)

                command.editReply({ embeds, components }).catch(console.error)
            }

            if (interaction.customId === "previous") {
                //  Previous page button
                page--

                setOptions([page * 25, (page + 1) * 25])

                if (page === 0) toggleButtons("previous", true)
                toggleButtons("next", false)

                command.editReply({ embeds, components }).catch(console.error)
            }
        }

        collector.on("collect", async (interaction) => {
            if (interaction.isSelectMenu()) return selectMenuInteraction(interaction)
            if (interaction.isButton()) return buttonInteraction(interaction)
        })

        collector.on("end", async (collection) => {
            if (collection.size === 0) {
                embeds = [new MessageEmbed().setColor("RED").setDescription("No reply from the user.")]
                return command.editReply({ embeds, components: [] }).catch(console.error) as any
            }

            if (!collection.last()?.message?.components?.length) return

            components = collection.last().message.components as MessageActionRow[]
            components.forEach((row) => row.components.forEach((item) => (item.disabled = true)))

            command.editReply({ components }).catch(console.error)
        })
    },
})
