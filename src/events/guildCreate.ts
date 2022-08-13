import { guildLog } from "../functions/log/logger"
import { Event } from "../structures/Event"

export default new Event("guildCreate", (guild) => guildLog(guild, "CREATE"))
