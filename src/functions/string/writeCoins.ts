import { coin } from "../../config"
import { numberFormatter } from "./numberFormatter"

export const writeCoin = (coins: number) => `**${numberFormatter(coins)}** ${coin}`
