import { getEmbed } from "../../functions/discord/getEmbed"
import { SelectMenu } from "../../structures/selectMenu"

export default new SelectMenu({
    name: "Baka-select-role",

    async execute(select) {
        const { member, values } = select

        const added: string[] = []
        const removed: string[] = []

        values.forEach((role) => {
            if (member.roles.cache.has(role)) {
                member.roles.remove(role).catch(console.error)
                return removed.push(role)
            }
            member.roles.add(role).catch(console.error)
            return added.push(role)
        })

        //  This message will send as ephemeral after selecting the roles
        let content = ""

        const map = (x: string) => `<@&${x}>`
        const roleMap = (roles: string[]) => roles.map(map).join(", ")
        const changeNumber = (arr: any[], name: string) => name + (arr.length > 1 ? "s" : "")

        if (added.length) content += `Added ${changeNumber(added, "role")} ${roleMap(added)}.`
        if (removed.length) content += `Removed ${changeNumber(removed, "role")} ${roleMap(removed)}`

        const embeds = [getEmbed(select).setDescription(content).setColor("GREEN")]
        //  reply
        return select.reply({ embeds, ephemeral: true }).catch(console.error)
    },
})
