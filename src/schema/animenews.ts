import mongoose from "mongoose"
const DATE = { type: Date, require: true, default: new Date() }
const STRING = { type: String, required: true }

export interface AnimeNewsDataType extends mongoose.Document {
    quickSave: () => any
    guildId: string
    channelId: string
    webhookURL: string
    lastPost: Date
}

const schema = new mongoose.Schema({
    guildId: STRING,
    channelId: STRING,
    webhookURL: STRING,
    lastPost: DATE,
})

export const AnimeNews = mongoose.model("AnimeNews", schema, "AnimeNews")
