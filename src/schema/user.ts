import mongoose from "mongoose"
const stringRequired = { type: String, required: true }
const numberRequired = { type: Number, required: true }

export interface UserDataType extends mongoose.Document {
    _id: string
    level: number
    xp: number
    coin: number
    bank: number
    bankSize: number
}

const schema = new mongoose.Schema({
    _id: stringRequired,
    level: numberRequired,
    xp: numberRequired,
    coin: numberRequired,
    bank: numberRequired,
    bankSize: numberRequired
})

export const UserDataBase = mongoose.model("UserDataBase", schema, "UserData")
