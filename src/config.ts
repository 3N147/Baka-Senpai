import { ActivitiesOptions, IntentsString, PartialTypes, PermissionString } from "discord.js"

export const intents: IntentsString[] = ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "DIRECT_MESSAGES"]
export const partials: PartialTypes[] = ["CHANNEL"]
export const color = "#2f3136"
export const guildId = "970403357904736276"
export const developers = ["759472423807746059"]
export const economy = {
    tax: 0.1,
    bankSize: 50000,
    daily: 5000,
    monthly: 500_000,
}
export const coin = "㋛"
export const waitTime = 1000 * 60
export const emojis = {
    download: "<:download:1002610379223990312>",
    head: "<:head:1005356615446319156>",
    coin: "<:bakacoin:1005372792595808298>",
    tail: "<:tail:1005356605107343411>",
    coinFlip: "<a:coinflip:1005356610744496248>",
    rightArrow: "<:right_arrow:1006961544602591243>",
    dices: [
        "<:dice1:1007241694795804682>",
        "<:dice2:1007241691763327036>",
        "<:dice3:1007241689225756806>",
        "<:dice4:1007241687275417610>",
        "<:dice5:1007241684784005210>",
        "<:dice6:1007241682363891742>",
    ],
}

export const botPermissions: PermissionString[] = [
    "EMBED_LINKS",
    "SEND_MESSAGES",
    "MANAGE_ROLES",
    "ATTACH_FILES",
    "MANAGE_EMOJIS_AND_STICKERS",
    "MANAGE_MESSAGES",
    "READ_MESSAGE_HISTORY",
]
