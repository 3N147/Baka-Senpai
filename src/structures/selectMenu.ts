import { SelectType } from "../typings/Components"

export class SelectMenu {
    constructor(commandOptions: SelectType) {
        Object.assign(this, commandOptions)
    }
}
