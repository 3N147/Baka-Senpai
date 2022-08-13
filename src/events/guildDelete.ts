import { guildLog } from "../functions/log/logger"
import { Event } from "../structures/Event"

export default new Event("guildDelete", (guild) => guildLog(guild, "DELETE"))
