import mongoose from "mongoose"
import { economy } from "../config"
import { ExtendedClient } from "../structures/Client"
const STRING = { type: String, required: true }
const NUMBER = { type: Number, required: true, default: 0 }
const DATE = { type: Date, require: true, default: new Date() }
const setNumber = (num: number) => ({ type: Number, required: true, default: num })

export interface UserDataType extends mongoose.Document {
    quickSave: (client: ExtendedClient) => any
    userId: string
    level: number
    xp: number
    coin: number
    bank: number
    bankSize: number
    daily: {
        amount: number
        time: Date
    }
}

const schema = new mongoose.Schema({
    userId: STRING,
    level: NUMBER,
    xp: NUMBER,
    coin: NUMBER,
    bank: NUMBER,
    bankSize: setNumber(economy.bankSize),
    daily: {
        amount: setNumber(economy.daily),
        time: DATE,
    },
})

export const UserDataBase = mongoose.model("UserDataBase", schema, "UserData")
