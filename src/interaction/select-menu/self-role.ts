import { MessageEmbed, MessageSelectMenu } from "discord.js"
import { SelectMenu } from "../../structures/selectMenu"

export default new SelectMenu({
    name: "Baka-select-role",

    async execute(select) {
        const { member, values } = select

        //  Taking role list from the components
        const selectComponent = select.message.components[0].components[0] as MessageSelectMenu

        //  Taking roles from selected option  to add
        const roleList = selectComponent.options.map((option) => option.value)

        //  Getting all available roles to add and remove to the member
        const guildRoles = select.guild.roles.cache.filter((role) => roleList.includes(role.id))

        //  Adding selected and removing unselected
        guildRoles.forEach((role) =>
            values.includes(role.id)
                ? member.roles.add(role).catch(console.error)
                : member.roles.remove(role).catch(console.error)
        )

        //  This message will send as ephemeral after selecting the roles
        const content = values.length
            ? `Now you have ${values.map((x) => `<@&${x}>`)} roles.`
            : `I removed all roles from you.`

        const embeds = [new MessageEmbed().setDescription(content).setColor("GREEN")]
        //  reply
        return select.reply({ embeds, ephemeral: true }).catch(console.error)
    },
})
