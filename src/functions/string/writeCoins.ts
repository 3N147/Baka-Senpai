import { coin } from "../../config"
import { numberWithComma } from "./numberFormatter"

export const writeCoin = (coins: number) => `**${numberWithComma(coins)} ${coin}**`
